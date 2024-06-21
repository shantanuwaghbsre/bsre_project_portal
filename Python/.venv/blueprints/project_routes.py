import random
from flask import Blueprint, Flask, request, jsonify, send_file
from service import make_db_call
import datetime
from datetime import timezone
from io import BytesIO
from pdf_management_helper import create_encrypted_pdf_from_html, create_html_from_template, create_bar_graph, create_line_graph, create_pdf_from_doc
from mailer import mail_to_consumer
import os
from dotenv import load_dotenv
load_dotenv()
import json
import re
import base64
import time


discom_paragraph = {
      "DGVCL": "Dakshin Gujarat Vij Company Limited, a Company registered under the Companies Act 1956/2013 and functioning as the ”Distribution Company” or “DISCOM” under the Electricity Act 2003 having its Head Office at, “Urja Sadan”, Nana Varachha Road, Kapodara Char Rasta, Surat-395006 (hereinafter referred to as “DGVCL” or “Distribution Licensee” or “DISCOM” which expression shall include its permitted assigns and successors) a Party of the Second Part.",
      "MGVCL": "Madhya Gujarat Vij Company Limited, a Company registered under the Companies Act 1956/2013 and functioning as the ”Distribution Company” or “DISCOM” under the Electricity Act 2003 having its Head Office at, Vadodara (hereinafter referred to as “MGVCL” or “Distribution Licensee” or “DISCOM” which expression shall include its permitted assigns and successors) a Party of the Second Part.",
      "PGVCL": "Paschim Gujarat Vij Company Limited, a Company registered under the Companies Act 1956/2013 and functioning as the ”Distribution Company” or “DISCOM” under the Electricity Act 2003 having its Head Office at, Rajkot (hereinafter referred to as “PGVCL” or “Distribution Licensee” or “DISCOM” which expression shall include its permitted assigns and successors) a Party of the Second Part.",
      "UGVCL": "Uttar Gujarat Vij Company Limited, a Company registered under the Companies Act 1956/2013 and functioning as the ”Distribution Company” or “DISCOM” under the Electricity Act 2003 having its Head Office at, Mehsana (hereinafter referred to as “UGVCL” or “Distribution Licensee” or “DISCOM” which expression shall include its permitted assigns and successors) a Party of the Second Part.",
    }

# Create a Blueprint object
blueprint = Blueprint('project_routes', __name__)

file_path = os.environ.get('QUERIES_FOLDER') + 'queries_for_projects.json'

try:
    if os.path.exists(file_path):
        with open(file_path, 'r') as file:
            queries = json.load(file)
    else:
        print("File does not exist.")
except Exception as e:
    print("An error occurred:", str(e))


@blueprint.route('/createProject', methods=['POST'])
def createProject():

    print("files", request.files, "form", request.form)

    make_db_call(queries["insert_project"], type_="insert", 
    parameters={
        "property_tax": request.files["property_tax"].read(),
        "electricity_bill": request.files["electricity_bill"].read(),
        "cancelled_cheque": request.files["cancelled_cheque"].read(),
        "other_documents":[file.read() for file in request.files.values() if file.name not in ["property_tax", "electricity_bill", "cancelled_cheque"]],
        "other_documents_names":[file.filename for file in request.files.values() if file.name not in ["property_tax", "electricity_bill", "cancelled_cheque"]],
        "meter_number": request.form["meter_number"],
        "current_sanctioned_load": request.form["current_sanctioned_load"],
        "average_consumption_of_unit": request.form["average_consumption_of_unit"],
        "consumer_number": request.form["consumer_number"],
        "project_type": request.form["project_type"],
        "project_address": request.form["project_address"],
        "latitude": request.form["latitude"],
        "longitude": request.form["longitude"],
        "total_kilowatts": request.form["total_kilowatts"],
        "solar_panel_type": request.form["solar_panel_type"],
        "project_cost": request.form["project_cost"],
        "deposit_amount": request.form["deposit_amount"],
        "remaining_balance": request.form["remaining_balance"],
        "deposited_money_in_words": request.form["deposited_money_in_words"],
        "payment_type": request.form["payment_type"],
        "transaction_number": request.form["transaction_number"],
        "bank_details_with_branch": request.form["bank_details_with_branch"],
        "national_portal_registration_number": request.form["national_portal_registration_number"],
        "from_quotation": request.form["from_quotation"],
        "project_email": request.form["project_email"],
        "project_in_phase": request.form["project_in_phase"],
        "timestamp": datetime.datetime.now(),
        "for_consumer_id": request.form["for_consumer_id"],
        "current_phase": request.form["current_phase"],
        "installation_phase": request.form["installation_phase"],
        "solar_panel_wattage": request.form["solar_panel_wattage"],
        "number_of_panels": request.form["number_of_panels"],
    })
    
    return {"success": True}

@blueprint.route('/getAllProjects', methods=['GET'])
def getAllProjects():
    page = int(request.args.get('page'))
    limit = int(request.args.get('limit'))
    
    search_by = request.args.get('searchDropdown')
    search_term = request.args.get('searchTerm')
    print(page, limit, search_by, search_term)
    # Calculate the total number of pages based on the limit
    count=0
    projects_query = [[None]]
    if search_by == 'consumer_number' and search_term:
        projects_query = make_db_call(query=queries['get_all_projects'].replace("##where##", f' WHERE {search_by} ilike %(' + 'search_for' + ')s'), type_="returns", parameters={"lower": (limit*(page-1)), "limit": limit, "search_for": '%' + search_term + '%'})
        count = make_db_call(query=queries['countPages'].replace("##where##", f' WHERE {search_by} ilike %(' + 'search_for' + ')s'), type_='returns', parameters={"search_for": '%' + search_term + '%'})[0][0]
        if count == None:
            count = 0
    else:
        projects_query = make_db_call(query=queries['get_all_projects'].replace("##where##", ''), type_="returns", parameters={"lower": (limit*(page-1)), "limit": limit})
        count = make_db_call(query=queries['countPages'].replace("##where##", ''), type_='returns', parameters={"search_for": '%' + search_term + '%'})[0][0]

    if projects_query == [[None]]:
        # Return an empty list of projects and total pages as 0
        return {"projects": [], "count": 0}
    
    # Process the projects query results and create a list of projects
    projects = []
    for row in projects_query:
        # Create a dictionary for each project with the specified fields
        project = {}
        for i in range(len(row)):
            project[queries['get_all_projects_column_names'][i]] = row[i] if row[i] else None

        # Add the project to the list
        projects.append(project)
    
    # Create the response dictionary with the projects and total pages
    response = {
        "projects": projects,
        "count": count
    }
    print(response)
    # Return the response
    return response

@blueprint.route('/getProject', methods=['GET'])
def getProject():
    project = {"phase_1":{}}
    data = make_db_call(queries["phase_details"].replace("column_names", ", ".join([column for column in queries["phase_details_column_names"]["1"]])).replace("table_name", "Projects"), "returns", parameters={"consumer_number": request.args.get('consumer_number')})
    print(data)
    for j, column in enumerate(queries[f"phase_details_column_names"]["1"] ):
        print(j, column)
        if column == 'other_documents':
            project[f"phase_1"][column] = [base64.b64encode(file).decode('utf-8') for file in data[0][j]] if data[0][j] is not None else []
        elif column == 'other_documents_names':
            project[f"phase_1"][column] = [str(i) for i in data[0][j]] if data[0][j] is not None else []
        elif type(data[0][j]) == memoryview:
                project[f"phase_1"][column] = base64.b64encode(bytes(data[0][j])).decode('utf-8')
        else:
            project[f"phase_1"][column] = data[0][j]
    # project["phase_1"] = {
    #     column: data[0][i] for i, column in enumerate(queries["phase_details_column_names"]["1"])
    # }
    for i in range(2, int(project["phase_1"]["project_in_phase"])+1):
        project_columns = queries[f"phase_details_column_names"][str(i)]
        data = make_db_call(queries[f"phase_details"].replace("column_names", ", ".join([column for column in project_columns])).replace("table_name", f"Project_phase_{i}"), "returns", parameters={"consumer_number": request.args.get('consumer_number')})
        if len(data[0]):
            project[f"phase_{i}"] = {}
            
            for j, column in enumerate(project_columns):
                if column == 'notes':
                    project[f"phase_{i}"][column] = '\n\n'.join(data[0][j]) if len(data[0][j]) else ''
                elif type(data[0][j]) == memoryview:
                    project[f"phase_{i}"][column] = base64.b64encode(bytes(data[0][j])).decode('utf-8')
                else:
                    project[f"phase_{i}"][column] = data[0][j]
    return project

@blueprint.route('/promoteToNextPhase', methods=['POST'])
def promoteToNextPhase():
    make_db_call(queries["update_project_in_phase"], "update", parameters={"consumer_number": request.json["consumer_number"], "project_in_phase": str(int(request.json["project_in_phase"])+1)})
    make_db_call(queries["promote_to_phase"].replace("table_name", f"Project_phase_{str(int(request.json['project_in_phase'])+1)}"), "insert", parameters={"consumer_number": request.json["consumer_number"]})
    return {"success": True}

@blueprint.route('/updatePhaseData', methods=['POST'])
def update_phase_data():
    dict_ = {}
    for i in request.form:
        if i == "notes":
            dict_[i] = request.form[i].split("\n\n")
        else:
            dict_[i] = request.form[i]
    for i in request.files:
        dict_[i] = request.files[i].read()
    make_db_call(
            queries["update_phase_data"]
            .replace("key_value_pairs", ", ".join([f"{column} = %({column})s" for column in dict_.keys() if column not in ["consumer_number", "project_in_phase"]]))
            .replace("table_name", f"Project_phase_{dict_['project_in_phase']}"), 
            "update", 
            parameters=dict_
            )
    return {"success": True}

@blueprint.route("/dummyAPI", methods=["GET", "POST"])
def dummyAPI():
    kw = {}
    projects = {}
    for i in range(12):
        projects[i] = []
        for j in range(random.randint(1, 5)):
            projects[i].append(["project " + str(i) + " " + str(j) + "", random.randint(2, int((random.random()*100)//1)+2)])
        kw[i] = 0
        for j in projects[i]:
            kw[i] += j[1]
    return {
         "sales": {
            "January":kw[0],
            "February":kw[1],
            "March":kw[2],
            "April":kw[3],
            "May":kw[4],
            "June":kw[5],
            "July":kw[6],
            "August":kw[7],
            "September":kw[8],
            "October":kw[9],
            "November":kw[10],
            "December":kw[11]
            },
            "projects": {
                "January":projects[0],
                "February":projects[1],
                "March":projects[2],
                "April":projects[3],
                "May":projects[4],
                "June":projects[5],
                "July":projects[6],
                "August":projects[7],
                "September":projects[8],
                "October":projects[9],
                "November":projects[10],
                "December":projects[11]            
            }
    }

@blueprint.route('/downloadFile', methods=['GET'])
def downloadFile():
    discom_paragraph = {
      "DGVCL": "Dakshin Gujarat Vij Company Limited, a Company registered under the Companies Act 1956/2013 and functioning as the ”Distribution Company” or “DISCOM” under the Electricity Act 2003 having its Head Office at, “Urja Sadan”, Nana Varachha Road, Kapodara Char Rasta, Surat-395006 (hereinafter referred to as “DGVCL” or “Distribution Licensee” or “DISCOM” which expression shall include its permitted assigns and successors) a Party of the Second Part.",
      "MGVCL": "Madhya Gujarat Vij Company Limited, a Company registered under the Companies Act 1956/2013 and functioning as the ”Distribution Company” or “DISCOM” under the Electricity Act 2003 having its Head Office at, Vadodara (hereinafter referred to as “MGVCL” or “Distribution Licensee” or “DISCOM” which expression shall include its permitted assigns and successors) a Party of the Second Part.",
      "PGVCL": "Paschim Gujarat Vij Company Limited, a Company registered under the Companies Act 1956/2013 and functioning as the ”Distribution Company” or “DISCOM” under the Electricity Act 2003 having its Head Office at, Rajkot (hereinafter referred to as “PGVCL” or “Distribution Licensee” or “DISCOM” which expression shall include its permitted assigns and successors) a Party of the Second Part.",
      "UGVCL": "Uttar Gujarat Vij Company Limited, a Company registered under the Companies Act 1956/2013 and functioning as the ”Distribution Company” or “DISCOM” under the Electricity Act 2003 having its Head Office at, Mehsana (hereinafter referred to as “UGVCL” or “Distribution Licensee” or “DISCOM” which expression shall include its permitted assigns and successors) a Party of the Second Part.",
      "Torrent_(Surat)": "Torrent Power Limited (Surat), ",
      "Torrent_(Ahmedabad)": "Torrent Power Limited (Ahmedabad), ",
    }
    if request.args.get('document_required') == "electrical_diagram":
        lookup_dictionary = {
            "electrical_diagram": "Project_phase_7",
        }
        data = make_db_call(
            queries["download_file"]
            .replace("table_name", lookup_dictionary[request.args.get('document_required')])
            .replace("document_required", request.args.get('document_required')), 
            "returns", 
            parameters={"consumer_number": request.args.get('consumer_number')}
            )
        bytestring = bytes(data[0][0])
        bytes_io = BytesIO(bytestring)
        bytes_io.seek(0)
        return send_file(bytes_io, mimetype="application/pdf", download_name=request.args["document_required"], as_attachment=True)

    elif request.args.get('document_required') == "vendoragreement":
        lookup_dictionary = {
            "residential": "Vendor Agreement",
        }

        additional_fields = {
            "date": datetime.datetime.now().strftime("%d-%m-%Y"),
        }

    elif request.args.get('document_required') == "agreement":
        lookup_dictionary = {
            "industrial": "Commercial Agreement",
            "residential": "Residential Agreement",
        }

        additional_fields = {
            "discom_paragraph": discom_paragraph[request.args.get('discom')],
            "day": datetime.datetime.now().strftime("%d") + ("th" if int(datetime.datetime.now().strftime("%d")) in [11, 12, 13] else {1: "st", 2: "nd", 3: "rd"}.get(int(datetime.datetime.now().strftime("%d")[-1]), "th")),
            "month": datetime.datetime.now().strftime("%B"),
            "year": datetime.datetime.now().strftime("%Y"),
            "full_discom_name": discom_paragraph[request.args.get('discom')].split(",")[0],
        }
        
    elif request.args.get('document_required') == "certificate":
        lookup_dictionary = {
            "1": "self certificate 1 page",
            "4": "self certificate 4 page",
        }

        additional_fields = {
            "1": {},
            "4": {},
        }
    elif request.args.get('document_required') == "dcr":
        print(request.args)
        lookup_dictionary = {
            "": "DCR",
        }

        additional_fields = {
            
        }

    with open(create_pdf_from_doc(lookup_dictionary[request.args.get("document_type")], request.args|additional_fields), 'rb') as f:
        b64encoded = base64.b64encode(f.read())
        bytes_io = BytesIO(b64encoded)
        bytes_io.seek(0)
        # print(f.read().decode("utf-8"))
        return send_file(bytes_io, mimetype="application/pdf", download_name=request.args["document_required"], as_attachment=True)


@blueprint.route("/upload", methods=["POST"])
def upload():
    print(request.files)
    make_db_call(queries["upload"], "update", parameters={"file": request.files["file"].read(), "consumer_number":"12345"})
    number_of_files = make_db_call(queries["number_of_files"], "returns", parameters={"consumer_number": "12345"})
    return {"success": True}

@blueprint.route("/getPanelDetails", methods=["GET"])
def getPanelDetails():
    panel_data = make_db_call(queries["get_panel_details"], "returns", parameters={"solar_panel_type": request.args.get("solar_panel_type")})
    print("panel_data - ", panel_data)
    return {column[0]: panel_data[0][j] for j, column in enumerate(queries["get_panel_details_column_names"])}
