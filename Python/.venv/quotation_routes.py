from flask import Blueprint, Flask, request, jsonify
from service import make_db_call
import datetime
from datetime import timezone
import pytz
from pdf_management_helper import create_encrypted_pdf_from_html, create_html_from_template, create_graph
from mailer import mail_to_consumer
import os
from dotenv import load_dotenv
load_dotenv()
import json

# Create a Blueprint object
blueprint = Blueprint('quotation_routes', __name__)

ist = pytz.timezone('Asia/Kolkata')
gmt = pytz.timezone('GMT')


# Read the JSON file
import os
import json

file_path = os.environ.get('QUERIES_FOLDER') + 'queries_for_quotations.json'

try:
    if os.path.exists(file_path):
        with open(file_path, 'r') as file:
            queries = json.load(file)
    else:
        print("File does not exist.")
except Exception as e:
    print("An error occurred:", str(e))

# queries = {
#     "add_agent":"INSERT INTO public.'Agents'(agent_name, agent_mobile_number, agent_address, agent_state) VALUES (%s,%s,%s,%s);",
    
#     "get_discom_charges":'''select total_amount from public."DISCOM_charges" where 	(system_capacity_upper_limit is not null and system_capacity_lower_limit < %(totalKiloWatts)s and %(totalKiloWatts)s <= system_capacity_upper_limit)	or	(system_capacity_upper_limit is null and system_capacity_lower_limit < %(totalKiloWatts)s);''',
    
#     "get_torrent_charges":'''select charge from public."Torrent_charges" where 	(system_capacity_upper_limit is not null and system_capacity_lower_limit < %(totalKiloWatts)s and %(totalKiloWatts)s <= system_capacity_upper_limit and phase like %(phase)s)	or	(system_capacity_upper_limit is null and system_capacity_lower_limit < %(totalKiloWatts)s and phase like %(phase)s);''',
    
#     "get_guvnl_charges": '''SELECT guvnl_price FROM public."Residential_GUVNL_prices" where number_of_panels=%(numberOfPanels)s and type_of_structure like %(structure)s and kilowatts=%(totalKiloWatts)s;''',
    
#     "get_last_quotation_number":'''select quotation_number from public."Residential_quotations" where quotation_number like %(location)s order by timestamp desc limit 1''',
    
#     "get_agents": '''SELECT agent_code, agent_name, agent_mobile_number, agent_address, agent_state FROM public."Agents";''',
    
#     "insert_residential_quotation": """INSERT INTO "Residential_quotations" ( quotation_number, consumer_mobile_number, consumer_email, consumer_address, timestamp, solar_module_wattage, total_kilowatts, number_of_panels, subsidy, guvnl_amount, net_guvnl_system_price, discom_or_torrent_charges, discom_or_torrent, phase, installation_ac_mcb_switch_charges, geb_agreement_fees, project_cost, quotation_type, agent_name, agent_code, location, structure, mounting_quantity, mounting_description, mounting_structure_make, solar_inverter_make, solar_panel_type, solar_module_name, consumer_name) VALUES ( %(quotation_number)s, %(consumer_mobile_number)s, %(consumer_email)s, %(consumer_address)s, %(timestamp)s, %(solar_module_wattage)s, %(total_kilowatts)s, %(number_of_panels)s, %(subsidy)s, %(guvnl_amount)s, %(net_guvnl_system_price)s, %(discom_or_torrent_charges)s, %(discom_or_torrent)s, %(phase)s, %(installation_ac_mcb_switch_charges)s, %(geb_agreement_fees)s, %(project_cost)s, %(quotation_type)s, %(agent_name)s, %(agent_code)s, %(location)s, %(structure)s, %(mounting_quantity)s, %(mounting_description)s, %(mounting_structure_make)s, %(solar_inverter_make)s, %(solar_panel_type)s, %(solar_module_name)s, %(consumer_name)s);""",
    
#     "getAllQuotations" : """select * from public."Residential_quotations" order by timestamp desc limit %(limit)s offset %(lower)s""",
    
#     "countPages" : '''select count(*) from public."Residential_quotations"''',
    
#     "insert_industrial_commercial_quotation" : '''INSERT INTO public."Industrial_commercial_quotations"( quotation_number, "timestamp", location, quotation_type, agent_code, agent_name, consumer_name, consumer_address, consumer_mobile_number, consumer_email, solar_module_name, solar_panel_type, number_of_panels, solar_module_wattage, total_kilowatts, solar_inverter_make, number_of_inverters, grid_tie_inverter_make, number_of_grid_tie_inverters, solar_cable, switch_and_gear_protection_make, sprinkler_installation, rate_per_watt, gst_per_watt, electricity_unit_rate, inflation_in_unit_rate, is_loan, loan_amount_on_project, loan_term, interest_rate_on_loan, reinvestment_rate, any_extra_cost_on_add_on_work, gst_on_add_on_work, is_subsidy, subsidy_per_watt, solar_structure) 	VALUES ( %(quotation_number)s, %(timestamp)s, %(location)s, %(quotation_type)s, %(agent_code)s, %(agent_name)s, %(consumer_name)s, %(consumer_address)s, %(consumer_mobile_number)s, %(consumer_email)s, %(solar_module_name)s, %(solar_panel_type)s, %(number_of_panels)s, %(solar_module_wattage)s, %(total_kilowatts)s, %(solar_inverter_make)s, %(number_of_inverters)s, %(grid_tie_inverter_make)s, %(number_of_grid_tie_inverters)s, %(solar_cable)s, %(switch_and_gear_protection_make)s, %(sprinkler_installation)s, %(rate_per_watt)s, %(gst_per_watt)s, %(electricity_unit_rate)s, %(inflation_in_unit_rate)s, %(is_loan)s, %(loan_amount_on_project)s, %(loan_term)s, %(interest_rate_on_loan)s, %(reinvestment_rate)s, %(any_extra_cost_on_add_on_work)s, %(gst_on_add_on_work)s, %(is_subsidy)s, %(subsidy_per_watt)s, %(solar_structure)s );''',
    
#     "get_last_industrial_commercial_quotation_number": '''select quotation_number from public."Industrial_commercial_quotations" where quotation_number like %(location)s order by timestamp desc limit 1''',
    
#     "get_average_daily_irradiation_by_month_for_city": '''select latitude, longitude, january, february, march, april, may, june, july, august, september, october, november, december from public."Average_daily_irradiation_by_city" where city=%(city)s''',
    
#     "get_locations": '''SELECT city FROM public."Average_daily_irradiation_by_city";''',
    
#     "get_pr_and_efficiency":'''SELECT pr_ratio, efficiency, area	FROM public."Panel_details" where solar_panel_type like %(solar_panel_type)s;'''
# }


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
    phase = request.json.get('phase').lower()
    number_of_panels = request.json.get('numberOfPanels')
    structure = request.json.get('structure')

    # Initialize the response dictionary
    response = {
        "subsidy": 0,
        "discom_or_torrent_charges": 0,
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

    # Calculate the discom or torrent charges based on the input values
    if discom_or_torrent == "discom" and phase == "three":
        response["discom_or_torrent_charges"] = 4910
    elif discom_or_torrent == "discom":
        response["discom_or_torrent_charges"] = make_db_call(query=queries['get_discom_charges'],
                                                            parameters={"totalKiloWatts": total_kilowatts},
                                                            type_="select")[0][0]
    elif discom_or_torrent == "torrent":
        response["discom_or_torrent_charges"] = make_db_call(query=queries['get_torrent_charges'],
                                                            parameters={"totalKiloWatts": total_kilowatts,
                                                                        "phase": phase},
                                                            type_="select")[0][0]

    # Calculate the guvnl amount based on the input values
    response['guvnl_amount'] = make_db_call(query=queries['get_guvnl_charges'],
                                            parameters={"numberOfPanels": number_of_panels,
                                                        "structure": structure,
                                                        "totalKiloWatts": total_kilowatts},
                                            type_="select")[0][0]

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
    locations = make_db_call(query=queries['get_locations'], type_="select")
    
    # Extract the city information from the location details and create a response list
    response = [{"city": location[0]} for location in locations]
    
    # Return the response
    return response

@blueprint.route('/getAgents', methods=['GET'])
def getAgents():
    """
    Get a list of agent details from the database.

    Returns:
        list: A list of dictionaries containing agent details. Each dictionary has the following keys:
            - agent_id (int): The ID of the agent.
            - agent_name (str): The name of the agent.
            - agent_mobile_number (str): The mobile number of the agent.
            - agent_address (str): The address of the agent.
            - agent_state (str): The state of the agent.

    """
    # Query the database to get agent details
    agent_details_list = make_db_call(query=queries['get_agents'], type_="select")

    # Create a response list by iterating over each agent details
    response = [
        {
            "agent_id": agent_details[0],
            "agent_name": agent_details[1],
            "agent_mobile_number": str(agent_details[2]),
            "agent_address": agent_details[3],
            "agent_state": agent_details[4]
        }
        for agent_details in agent_details_list
    ]

    # Return the response list
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
    response = {}

    # Retrieve the last quotation number from the database
    last_quotation = make_db_call(
        query=queries['get_last_quotation_number'],
        parameters={"location": request.json["agent_code"][:3] + "%"},
        type_="select"
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

    # Create an HTML file from a template based on the request JSON
    html_file_path = create_html_from_template(request.json)

    # Create an encrypted PDF file from the HTML file
    create_encrypted_pdf_from_html(html_file_path, request.json)

    # Send an email to the consumer with the PDF attachment and retrieve the message and filename
    message, filename = mail_to_consumer(request.json)

    # Remove the temporary PDF file
    os.remove(os.environ.get['TEMPORARY_FILES_FOLDER'] + filename)

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
        type_="select"
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
        type_="select"
    )[0]

    # Add the current timestamp to the request
    request.json["timestamp"] = datetime.datetime.now()

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

    # Get average daily irradiation data from the database for the specified city
    irradiation_data = make_db_call(
        queries["get_average_daily_irradiation_by_month_for_city"],
        parameters={"city": request.json['location']},
        type_="select"
    )[0]

    # Add latitude, longitude, and irradiation data to the request
    request.json['latitude'], request.json['longitude'], request.json['irradiation_data'] = irradiation_data[0], irradiation_data[1], irradiation_data[2:]

    # Set the GRAPHS_FOLDER environment variable
    request.json["GRAPHS_FOLDER"] = os.environ.get("GRAPHS_FOLDER")

    # Calculate monthly production based on irradiation data, pr_ratio, efficiency, area, and number of panels
    request.json["monthly_production"] = [
        float('{0:.2f}'.format(i * pr_ratio * efficiency * area * request.json['number_of_panels'] *
                               list(request.json["months"].values())[idx]))
        for idx, i in enumerate(request.json["irradiation_data"])
    ]

    # Calculate monthly earnings based on monthly production and rate
    request.json["monthly_earnings"] = [
        float('{0:.2f}'.format(i * request.json["rate_per_watt"])) for i in request.json["monthly_production"]
    ]
    

    # Calculate the sum of the values in the "irradiation_data" list of the JSON request and multiply it by month days to find total monthly irradiation
    request.json["yearly_irradiation"] = float('{0:.2f}'.format(sum([request.json["irradiation_data"][i] * list(request.json["months"].values())[i] for i in range(len(request.json["irradiation_data"]))])))
                                          
    # Calculate the sum of the values in the "monthly_production" list of the JSON request
    request.json["annual_production"] = float('{0:.2f}'.format(sum(request.json["monthly_production"])))
    
    # Calculate the sum of the values in the "monthly_earnings" list of the JSON request
    request.json["annual_earnings"] = float('{0:.2f}'.format(sum(request.json["monthly_earnings"])))

    # Create graphs
    graphs = [
        {
            "data": request.json['irradiation_data'],
            "x_label": "Months",
            "y_label": "kWh/m2",
            "color": "maroon",
            "width": 0.8,
            "title": "Avg. Daily Irradiation per square metre",
            "filename": "page3.1.png"
        },
        {
            "data": request.json["monthly_production"],
            "x_label": "Months",
            "y_label": "KiloWatts",
            "color": "orange",
            "width": 0.8,
            "title": "Avg. production per month",
            "filename": "page3.2.png"
        },
        {
            "data": request.json["monthly_earnings"],
            "x_label": "Months",
            "y_label": "Rs. (in lakhs)",
            "color": "green",
            "width": 0.8,
            "title": "Avg. earnings per month",
            "filename": "page3.3.png"
        }
    ]

    for graph in graphs:
        create_graph(X_data=request.json["months"].keys(), 
                    Y_data=graph["data"], 
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
                - 'DISCOM/Torrent charges' (str): The DISCOM/Torrent charges.
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
    
    # Calculate the total number of pages based on the limit
    total_pages_query = make_db_call(query=queries['countPages'], type_='select')
    total_pages = int(total_pages_query[0][0]) // limit + 1
    
    # Get the quotations for the current page
    quotations_query = make_db_call(query=queries['getAllQuotations'], type_="select", parameters={"lower": (limit*(page-1)), "limit": limit})
    
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
            "DISCOM/Torrent charges": row[9],
            "DISCOM/Torrent": row[10],
            "Phase": row[11],
            "Installation AC MCB switch charges": row[12],
            "GEB agreement fees": row[13],
            "Project cost": row[14],
            "Quotation type": row[15],
            "Agent name": row[16],
            "Location": row[17],
            "Structure": row[18],
            "Mounting quantity": row[19],
            "Mounting description": row[20],
            "Mounting structure make": row[21],
            "Solar inverter make": row[22],
            "Solar panel type": row[23],
            "Solar module name": row[24],
            "Consumer name": row[25],
            "Timestamp": gmt.localize(row[26]).astimezone(ist),
            "Agent code": row[27],
            "Consumer email": row[28]
        }
        # Add the quotation to the list
        quotations.append(quotation)
    
    # Create the response dictionary with the quotations and total pages
    response = {
        "quotations": quotations,
        "totalPages": total_pages
    }
    # Return the response
    return response
