import base64
from flask import Blueprint, Flask, request, jsonify, send_file
import requests
import datetime
from datetime import timezone
import pytz
from pdf_management_helper import create_encrypted_pdf_from_html, create_html_from_template, create_bar_graph, create_line_graph
from mailer import mail_to_consumer
import os
from dotenv import load_dotenv
load_dotenv()
import json

#For Vercel
from ..service import make_db_call

#For Local
# from service import make_db_call

# Create a Blueprint object
blueprint = Blueprint('quotation_routes', __name__)

ist = pytz.timezone('Asia/Kolkata')
gmt = pytz.timezone('GMT')

file_path = os.path.abspath(os.getcwd()) + '/Python/.venv/queries/queries_for_quotations.json'

try:
    if os.path.exists(file_path):
        with open(file_path, 'r') as file:
            queries = json.load(file)
    else:
        print("File does not exist.")
except Exception as e:
    print("An error occurred:", str(e))

@blueprint.route('/searchQuotations', methods=['GET'])
def searchQuotations():
    return [i[0] for i in make_db_call(queries["search_quotations"], "returns", parameters={"partial_quotation_number":request.args.get('partial_quotation_number')+"%"})]

@blueprint.route('/calculate', methods=['POST'])
def calculate():
    """
    Calculate the subsidy, discom or torrent charges, and guvnl amount based on the input values.
    
    Parameters:
        None
    
    Returns:
        response (dict): A dictionary containing the calculated subsidy, discom or torrent charges, and guvnl amount.
            - subsidy (int): The calculated subsidy amount.
            - discom_or_torrent_charges (int): The calculated discom or torrent charges.
            - guvnl_amount (int): The calculated guvnl amount.
    """
    # Extract the values from the JSON payload
    total_kilowatts = request.json.get('totalKiloWatts')
    discom_or_torrent = request.json.get('discomOrTorrent').lower()
    phase = request.json.get('phase')
    number_of_panels = request.json.get('numberOfPanels')
    structure = request.json.get('structure')

    # Initialize the response dictionary
    response = {
        "subsidy": 0,
        "guvnl_amount": 0
    }

    # Calculate the subsidy based on the total kilowatts
    if total_kilowatts and total_kilowatts <= 3:
        response["subsidy"] = 14588 * total_kilowatts
    elif 3 < total_kilowatts <= 10:
        response["subsidy"] = (14588 * 3) + ((total_kilowatts - 3) * 7294)
    else:
        response["subsidy"] = 94822

    # Round the subsidy amount to the nearest integer
    response["subsidy"] = round(response["subsidy"])

    # Calculate the guvnl amount based on the input values
    response['guvnl_amount'] = make_db_call(query=queries['get_guvnl_charges'],
                                            parameters={"numberOfPanels": number_of_panels,
                                                        "structure": structure,
                                                        "totalKiloWatts": total_kilowatts},
                                            type_="returns")[0][0]

    # Calculate the discom or torrent charges based on the input values
    if total_kilowatts > 6 and discom_or_torrent == 'discom':
        phase = 'Single'
    response['discom_or_torrent_charges'] = make_db_call(query=queries['get_'+discom_or_torrent+'_charges'],
                                              parameters={"phase": phase,
                                                          "totalKiloWatts": total_kilowatts},
                                              type_="returns")[0][0]
    # Return the response dictionary
    return response

@blueprint.route('/getLocations', methods=['GET'])
def getLocations():
    """
    Retrieves location details from the database using a custom query and returns a response list containing the city information.
    
    Parameters:
    None
    
    Returns:
    list: A list of dictionaries containing the city information for each location.
    """
    # Retrieve location details from the database using a custom query
    response = {}
    locations = make_db_call(query=queries['get_locations'], type_="returns")
    print(set(location[0] for location in locations))
    for state in set([location[0] for location in locations]):
        response[state] = {}
        for location in locations:
            if location[0] == state:
                response[state][location[1]] = {"latitude":location[2], "longitude":location[3]}
    # Return the response
    return response


@blueprint.route('/submitResidentialQuotation', methods=['POST'])
def submitResidentialQuotation():
    """
    Submit a residential quotation.

    This function is responsible for submitting a residential quotation. It retrieves the last quotation number from the database, constructs a new quotation number based on agent code, quotation type, and current date, and updates the request JSON with the quotation number and timestamp. It then inserts the residential quotation into the database, converts the guvnl_amount and subsidy fields to integers, creates an HTML file from a template based on the request JSON, creates an encrypted PDF file from the HTML file, sends an email to the consumer with the PDF attachment, and removes the temporary PDF file. Finally, it returns the response.

    Parameters:
    None

    Returns:
    response (dict): A dictionary containing the completion status of the submission and, if successful, the quotation number.

    """

    def download_image(file_path):
        with open(file_path, 'rb') as file:
            image_data = file.read()
        return 'data:;base64,' + base64.b64encode(image_data).decode('utf-8')

    response = {}

    # Retrieve the last quotation number from the database
    last_quotation = make_db_call(
        query=queries['get_last_quotation_number'],
        parameters={"location": request.json["agent_code"][:3] + "%"},
        type_="returns"
    )[0][0]

    # Construct the quotation number based on agent code, quotation type, and current date
    quotation_number = (
        request.json['agent_code'][:3] + "/" +
        request.json["quotation_type"][0] + "/" +
        datetime.datetime.now().strftime("%d%m%y") + "/"
    )

    # Check if there is a last quotation number
    if last_quotation:
        # Check if the last quotation number has the same date as the current date
        if last_quotation[6:12] == datetime.datetime.now().strftime("%d%m%y"):
            # Increment the last quotation number by 1
            quotation_number += f"{int(last_quotation[-4:]) + 1:04d}"
        else:
            # Set the last quotation number to 1
            quotation_number += f"{1:04d}"
    else:
        # Set the last quotation number to 1
        quotation_number += f"{1:04d}"

    # Update the request JSON with the quotation number and timestamp
    request.json["quotation_number"] = quotation_number
    request.json["timestamp"] = datetime.datetime.now()

    # Insert the residential quotation into the database
    response["completed"] = make_db_call(
        query=queries['insert_residential_quotation'],
        parameters=request.json,
        type_="insert"
    )

    # If the insertion was successful, add the quotation number to the response
    if response["completed"]:
        response["quotation_number"] = quotation_number

    # Convert the guvnl_amount and subsidy fields to integers
    request.json['guvnl_amount'] = int(request.json['guvnl_amount'])
    request.json['subsidy'] = int(request.json['subsidy'])
    request.json['header'] = download_image(os.path.join(os.environ.get("ASSETS_FOLDER"), "header.png")),
    request.json['footer'] = download_image(os.path.join(os.environ.get("ASSETS_FOLDER"), "footer.png"))

    # Create an HTML file from a template based on the request JSON
    html_file_path = create_html_from_template(request.json)

    # Create an encrypted PDF file from the HTML file
    create_encrypted_pdf_from_html(html_file_path, request.json)

    # Send an email to the consumer with the PDF attachment and retrieve the message and filename
    message, filename = mail_to_consumer(request.json)

    # Remove the temporary PDF file
    os.remove(os.environ.get('TEMPORARY_FILES_FOLDER') + filename)

    # Return the response
    return response

@blueprint.route('/submitIndustrialCommercialQuotation', methods=['POST'])
def submitIndustrialCommercialQuotation():
    # Initialize response dictionary
    response = {}

    # Get the last quotation number from the database
    last_quotation = make_db_call(
        query=queries['get_last_industrial_commercial_quotation_number'],
        parameters={"location": request.json["agent_code"][:3] + "%"},
        type_="returns"
    )[0][0]

    # Generate the quotation number based on agent code, quotation type, and current date
    request.json["quotation_number"] = (
        request.json['agent_code'][:3] +
        "/" +
        request.json["quotation_type"][0] +
        "/" +
        datetime.datetime.now().strftime("%d%m%y") +
        "/"
    )

    # Check if there is a last quotation and if it was generated on the same day
    if last_quotation and last_quotation[6:12] == datetime.datetime.now().strftime("%d%m%y"):
        # Increment the last quotation number
        request.json["quotation_number"] += f"{int(last_quotation[-4:]) + 1:04d}"
    else:
        # Set the quotation number to 1
        request.json["quotation_number"] += f"{1:04d}"

    # Get pr_ratio, efficiency, and area from the database based on solar panel type
    pr_ratio, efficiency, area = make_db_call(
        query=queries['get_pr_and_efficiency'],
        parameters={"solar_panel_type": request.json["solar_panel_type"]},
        type_="returns"
    )[0]

    # Add the current timestamp to the request
    request.json["timestamp"] = datetime.datetime.now()

    request.json["project_cost"] = ((request.json["rate_per_watt"] + request.json["gst_per_watt"] - request.json["subsidy_per_watt"]) * 1000 * request.json["total_kilowatts"]) + (request.json["any_extra_cost_on_add_on_work"] + request.json["gst_on_add_on_work"]) 
    # Insert the quotation into the database
    response["completed"] = make_db_call(
        query=queries['insert_industrial_commercial_quotation'],
        parameters=request.json,
        type_="insert"
    ) 

    # If the quotation was successfully inserted, add the quotation number to the response
    if response["completed"]:
        response["quotation_number"] = request.json["quotation_number"]

    # Define a dictionary with the number of days in each month
    request.json["months"] = {
        "January": 31,
        "February": 28,
        "March": 31,
        "April": 30,
        "May": 31,
        "June": 30,
        "July": 31,
        "August": 31,
        "September": 30,
        "October": 31,
        "November": 30,
        "December": 31
    }


    request.json["monthly_irradiation_data"] = make_db_call(
        queries["get_average_daily_irradiation_by_month_for_city"],
        parameters={"city": request.json['city']},
        type_="returns"
    )[0]

    if not request.json["monthly_irradiation_data"][0]:
        request.json["monthly_irradiation_data"] = requests.get(f"https://vedas.sac.gov.in/powerGisService/insol_temp_calc/{request.json['longitude']}/{request.json['latitude']}/kwh").json()["insol_avg"]
        request.json["irradiation_data"] =[round(i/list(request.json["months"].values())[idx], 2) for idx, i in enumerate(request.json["monthly_irradiation_data"])]

    request.json["irradiation_data"] = [round(float(i), 2) for i in request.json["monthly_irradiation_data"]]
    

    # Set the GRAPHS_FOLDER environment variable
    request.json["GRAPHS_FOLDER"] = os.environ.get("GRAPHS_FOLDER")

    # Calculate monthly production based on irradiation data, pr_ratio, efficiency, area, and number of panels
    print(type(pr_ratio), type(efficiency), type(area), type(request.json['number_of_panels']), type(request.json["monthly_irradiation_data"][0]), pr_ratio, efficiency, area, request.json['number_of_panels'], request.json["monthly_irradiation_data"])
    request.json["monthly_production"] = [
        round(i * pr_ratio * efficiency * area * request.json['number_of_panels'], 2)
        for idx, i in enumerate(request.json["monthly_irradiation_data"])
    ]

    # Calculate monthly earnings based on monthly production and rate
    request.json["monthly_earnings"] = [
        round(i * request.json["rate_per_watt"], 2) for i in request.json["monthly_production"]
    ]
    

    # Calculate the sum of the values in the "irradiation_data" list of the JSON request and multiply it by month days to find total monthly irradiation
    request.json["yearly_irradiation"] = round(sum(request.json["monthly_irradiation_data"]), 2)
                                          
    # Calculate the sum of the values in the "monthly_production" list of the JSON request
    request.json["annual_production"] = round(sum(request.json["monthly_production"]), 2)
    
    # Calculate the sum of the values in the "monthly_earnings" list of the JSON request
    request.json["annual_earnings"] = round(sum(request.json["monthly_earnings"]), 2)

    # Degradation calculations
    # Calculate the total cost based on various parameters
    request.json["total_cost"] = round(((request.json["rate_per_watt"] + request.json["gst_per_watt"] - request.json["subsidy_per_watt"]) * 1000 * request.json["total_kilowatts"]) + (request.json["any_extra_cost_on_add_on_work"] + request.json["gst_on_add_on_work"]), 2)
    print(request.json["total_cost"])
    # Calculate the production degradation over a period of 24 years
    request.json["production_degradation"] = [request.json["annual_production"], round(request.json["annual_production"]*0.98, 2)] + [round(request.json["annual_production"]*0.98 * 0.996 ** i, 2) for i in range(1, 25)]
    
    # Calculate the earnings degradation based on the production degradation
    request.json["earnings_degradation"] = [round(i * 7.5, 2) for i in request.json["production_degradation"]]
    
    # Calculate the breakeven point over a period of 24 years
    request.json["breakeven"] = [-request.json["total_cost"] + request.json["earnings_degradation"][0]] 
    for i in range(1, 25):
      request.json["breakeven"].append(round(request.json["breakeven"][i - 1] + request.json["earnings_degradation"][i],2))

    # Create graphs
    graphs = [
        {
            "X_data": request.json["months"].keys(),
            "Y_data": request.json['irradiation_data'],
            "x_label": "Months",
            "y_label": "kWh/m2",
            "color": "maroon",
            "width": 0.8,
            "title": "Avg. Daily Irradiation per square metre",
            "filename": "Industrial_Commercial_Graph_1.png",
            "type": "bar",
            "individual_bar_values_requested": True
        },
        {
            "X_data": request.json["months"].keys(),
            "Y_data": [round(i / 100, 2) for i in request.json["monthly_production"]],
            "x_label": "Months",
            "y_label": "MegaWatts",
            "color": "orange",
            "width": 0.8,
            "title": "Avg. production per month",
            "filename": "Industrial_Commercial_Graph_2.png",
            "type": "bar",
            "individual_bar_values_requested": True
        },
        {
            "X_data": request.json["months"].keys(),
            "Y_data": [round(i / 1000, 2) for i in request.json["monthly_earnings"]],
            "x_label": "Months",
            "y_label": "Rs. (in thousands)",
            "color": "green",
            "width": 0.8,
            "title": "Avg. earnings per month",
            "filename": "Industrial_Commercial_Graph_3.png",
            "type": "bar",
            "individual_bar_values_requested": True
        },
        {
            "X_data": [str(i) for i in range(1, 26)],
            "Y_data": request.json["production_degradation"][:25],
            "x_label": "years",
            "y_label": "kiloWatts",
            "color": "midnightblue",
            "width": 1.5,
            "title": "Production degradation",
            "filename": "Industrial_Commercial_Graph_4.png",
            "type": "line"
        },
        {
            "X_data": [str(i) for i in range(1, 26)],
            "Y_data": request.json["earnings_degradation"][:25],
            "x_label": "years",
            "y_label": "Rs.",
            "color": "purple",
            "width": 1.5,
            "title": "Earnings degradation",
            "filename": "Industrial_Commercial_Graph_5.png",
            "type": "line"
        },
        {
            "X_data": [str(i) for i in range(1, 26)],
            "Y_data": request.json["breakeven"],
            "x_label": "years",
            "y_label": "ROI",
            "color": "lightgreen",
            "width": 0.8,
            "title": "Breakeven",
            "filename": "Industrial_Commercial_Graph_6.png",
            "type": "bar",
            "individual_bar_values_requested": False
        }
    ]

    for graph in graphs:
        if graph["type"] == "bar":
          create_bar_graph(X_data=graph["X_data"], 
                    Y_data=graph["Y_data"], 
                    X_label=graph["x_label"], 
                    Y_label=graph["y_label"], 
                    color_=graph["color"], 
                    width_=graph["width"], 
                    title=graph["title"], 
                    filename=graph["filename"],
                    individual_bar_values_requested=graph["individual_bar_values_requested"])
        else:
          create_line_graph(X_data=graph["X_data"], 
                    Y_data=graph["Y_data"], 
                    X_label=graph["x_label"], 
                    Y_label=graph["y_label"], 
                    color_=graph["color"], 
                    width_=graph["width"], 
                    title=graph["title"], 
                    filename=graph["filename"])

    # Generate HTML file from template
    html_file_path = create_html_from_template(request.json)

    # Create encrypted PDF from HTML
    create_encrypted_pdf_from_html(html_file_path, request.json)

    # Send email to consumer
    message, filename = mail_to_consumer(request.json)

    # Remove temporary file
    os.remove(os.path.join(os.environ.get('TEMPORARY_FILES_FOLDER'), filename))

    return response

@blueprint.route('/getAllQuotations', methods=['GET'])
def getAllQuotations():
    """
    Retrieves all quotations based on the provided page number and limit.
    
    Parameters:
        None
    
    Returns:
        dict: A dictionary containing the list of quotations and the total number of pages.
            - 'quotations' (list): A list of dictionaries representing each quotation with various fields.
                - 'Quotation number' (str): The quotation number.
                - 'Consumer mobile number' (str): The consumer's mobile number.
                - 'Consumer address' (str): The consumer's address.
                - 'Solar module wattage' (str): The wattage of the solar module.
                - 'Total kilowatts' (str): The total kilowatts.
                - 'Number of panels' (str): The number of solar panels.
                - 'Subsidy' (str): The subsidy.
                - 'GUVNL amount' (str): The GUVNL amount.
                - 'Net GUVNL system price' (str): The net GUVNL system price.
                - 'DISCOM/Torrent' (str): The DISCOM/Torrent.
                - 'Phase' (str): The phase.
                - 'Installation AC MCB switch charges' (str): The installation AC MCB switch charges.
                - 'GEB agreement fees' (str): The GEB agreement fees.
                - 'Project cost' (str): The project cost.
                - 'Quotation type' (str): The quotation type.
                - 'Agent name' (str): The agent's name.
                - 'Location' (str): The location.
                - 'Structure' (str): The structure.
                - 'Mounting quantity' (str): The quantity of mountings.
                - 'Mounting description' (str): The description of the mountings.
                - 'Mounting structure make' (str): The make of the mounting structure.
                - 'Solar inverter make' (str): The make of the solar inverter.
                - 'Solar panel type' (str): The type of solar panel.
                - 'Solar module name' (str): The name of the solar module.
                - 'Consumer name' (str): The consumer's name.
                - 'Timestamp' (datetime): The timestamp of the quotation.
                - 'Agent code' (str): The agent's code.
                - 'Consumer email' (str): The consumer's email.
            - 'totalPages' (int): The total number of pages of quotations.
    """
    # Get the page number and limit from the query parameters
    page = int(request.args.get('page'))
    limit = int(request.args.get('limit'))
    search_by = request.args.get('searchDropdown').lower().replace(" ", "_")
    search_for = request.args.get('searchTerm')
    print(len(search_for), type(search_for))
    # Calculate the total number of pages based on the limit
    # count = int(make_db_call(query=queries['countRecords'].replace("##where##", 'where '+search_by+' like %(' + 'search_for' + ')s'), type_="returns", parameters={"search_for": '%' + search_for + '%'})[0][0])
    
       
    # Get the quotations for the current page
    count=0
    quotations_query = [[None]]
    if search_by == 'all':
        quotations_query = make_db_call(query=queries['getAllQuotations'].replace("##where##", ''), type_="returns", parameters={"lower": (limit*(page-1)), "limit": limit, })
        count = int(make_db_call(query=queries['countRecords'].replace("##where##", ''), type_="returns", parameters={"search_for": '%' + search_for + '%'})[0][0])
    elif search_by == 'agent_name' or search_by == 'consumer_name':
        quotations_query = make_db_call(query=queries['getAllQuotations'].replace("##where##", 'where '+search_by+' ilike %(' + 'search_for' + ')s'), type_="returns", parameters={"lower": (limit*(page-1)), "limit": limit, "search_for": '%' + search_for + '%'})
        count = make_db_call(query=queries['countRecords'].replace("##where##", 'where '+search_by+' ilike %(' + 'search_for' + ')s'), type_="returns", parameters={"search_for": '%' + search_for + '%'})[0][0]
        if count == None:
            count = 0
        else:
            count = int(count)
    
    # Check if there are no quotations for the current page
    if quotations_query == [[None]]:
        # Return an empty list of quotations and total pages as 0
        return {"quotations": [], "totalPages": 0}
    
    # Process the quotations query results and create a list of quotations
    quotations = []
    for row in quotations_query:
        # Create a dictionary for each quotation with the specified fields
        quotation = {
            "Quotation number": row[0],
            "Consumer mobile number": row[1],
            "Consumer address": row[2],
            "Solar module wattage": row[3],
            "Total kilowatts": row[4],
            "Number of panels": row[5],
            "Subsidy": row[6],
            "GUVNL amount": row[7],
            "Net GUVNL system price": row[8],
            "DISCOM/Torrent": row[9],
            "Phase": row[10],
            "Installation AC MCB switch charges": row[11],
            "GEB agreement fees": row[12],
            "Project cost": row[13],
            "Quotation type": row[14],
            "Agent name": row[15],
            "Location": row[16],
            "Structure": row[17],
            "Mounting quantity": row[18],
            "Mounting description": row[19],
            "Mounting structure make": row[20],
            "Solar inverter make": row[21],
            "Solar panel type": row[22],
            "Solar module name": row[23],
            "Consumer name": row[24],
            "Timestamp": gmt.localize(row[25]).astimezone(ist),
            "Agent code": row[26],
            "Consumer email": row[27],
            "Solar cable":row[28],
            "Switch and Gear":row[29],
            "Sprinkler installation":row[30],
            "Rate/W":row[31],
            "GST/W":row[32],
            "Unit rate":row[33],
            "Inflation in unit rate":row[34],
            "Loan taken?":row[35],
            "Loan Amount":row[36],
            "Loan Term":row[37],
            "Loan Interest":row[38],
            "Reinvestment rate":row[39],
            "Extra cost":row[40],
            "GST on extra cost":row[41],
            "Subsidy?":row[42],
            "Subsidy/W":row[43],
            "Structure":row[44],
            "Inverter capacity":row[45]
        }
        # Add the quotation to the list
        quotations.append(quotation)
    
    # Create the response dictionary with the quotations and total pages
    response = {
        "quotations": quotations,
        "count": count
    }
    # Return the response
    return response

@blueprint.route('/searchSpecificQuotation', methods=['GET'])
def searchSpecificQuotation():
    return_ = make_db_call(queries["search_specific_residential_quotation"], "returns", parameters={"quotation_number":request.args.get('quotation_number')}) \
        if request.args.get('quotation_number')[4] == 'R' \
        else make_db_call(queries["search_specific_industrial_quotation"], "returns", parameters={"quotation_number":request.args.get('quotation_number')})
    
    response = {
        "project_type": return_[0][0],
        "total_kilowatts": return_[0][1],
        "solar_panel_type": return_[0][2],
        "project_cost": return_[0][3],
        "location": return_[0][4],
        "solar_inverter_make": return_[0][5],
        "solar_panel_wattage": return_[0][6],
        "number_of_panels": return_[0][7],
    }

    return response