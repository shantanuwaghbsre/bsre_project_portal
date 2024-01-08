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
    make_db_call(queries["insert_project"], type_="insert", 
    parameters={
        "property_tax": request.files["property_tax"].read(),
        "electricity_bill": request.files["electricity_bill"].read(),
        "cancelled_cheque": request.files["cancelled_cheque"].read(),
        "other_document": request.files["other_document"].read(),
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
    })
    
    return {"success": True}

@blueprint.route('/getAllProjects', methods=['GET'])
def getAllProjects():
    page = int(request.args.get('page'))
    limit = int(request.args.get('limit'))
    
    # Calculate the total number of pages based on the limit
    total_pages_query = make_db_call(query=queries['countPages'], type_='select')
    total_pages = int(total_pages_query[0][0]) // limit + 1
    
    projects_query = make_db_call(query=queries['get_all_projects'], type_="select", parameters={"lower": (limit*(page-1)), "limit": limit})

    if projects_query == [[None]]:
        # Return an empty list of projects and total pages as 0
        return {"projects": [], "totalPages": 0}
    
    # Process the projects query results and create a list of projects
    projects = []
    for row in projects_query:
        # Create a dictionary for each project with the specified fields
        project = {
            "meter_number":row[0],
            "consumer_number":row[1],
            "project_type":row[2],
            "project_address":row[3],
            "project_email":row[4],
            "project_in_phase":row[5],
            "for_consumer_id":row[6]
            }
        # Add the project to the list
        projects.append(project)
    
    # Create the response dictionary with the projects and total pages
    response = {
        "projects": projects,
        "totalPages": total_pages
    }
    # Return the response
    return response

@blueprint.route('/getProject', methods=['GET'])
def getProject():
    project = {}
    project_columns = ["meter_number", "current_sanctioned_load", "average_consumption_of_unit", "consumer_number", "project_type", "project_address", "latitude", "longitude", "total_kilowatts", "solar_panel_type", "project_cost", "deposit_amount", "remaining_balance", "deposited_money_in_words", "payment_type", "transaction_number", "bank_details_with_branch", "national_portal_registration_number", "from_quotation", "project_email", "project_in_phase"]
    print("project_columns", project_columns)
    project_data = make_db_call(queries["phase_1_details"], "select", parameters={"consumer_number": request.args.get('consumer_number')})
    project["phase_1"] = {
        column: project_data[0][i] for i, column in enumerate(project_columns)
    }
    for i in range(2, int(project["phase_1"]["project_in_phase"])+1):
        project_columns = [i for i in make_db_call(queries["get_columns"], "select", parameters={"table_name": f"Project_phase_{i}"})]
        print("project_columns", project_columns)
        project_data = make_db_call(queries[f"phase_details"].replace("column_names", ", ".join([str(column[0]) for column in project_columns])).replace("table_name", f"Project_phase_{i}"), "select", parameters={"consumer_number": request.args.get('consumer_number')})
        if len(project_data[0]):
            project[f"phase_{i}"] = {}
            for j, column in enumerate(project_columns):
                if type(project_data[0][j]) == memoryview:
                    project[f"phase_{i}"][column[0]] = base64.b64encode(bytes(project_data[0][j])).decode('utf-8')
                else:
                    project[f"phase_{i}"][column[0]] = project_data[0][j]
    return project

@blueprint.route('/promoteToNextPhase', methods=['POST'])
def promoteToNextPhase():
    make_db_call(queries["update_project_in_phase"], "update", parameters={"consumer_number": request.json["consumer_number"], "project_in_phase": str(int(request.json["project_in_phase"])+1)})
    if int(request.json["project_in_phase"]) != 6: 
        make_db_call(queries["promote_to_phase"].replace("table_name", f"Project_phase_{str(int(request.json['project_in_phase'])+1)}"), "insert", parameters={"consumer_number": request.json["consumer_number"]})
    return {"success": True}

@blueprint.route('/updatePhaseData', methods=['POST'])
def update_phase_data():
    dict_ = {}
    for i in request.form:
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


@blueprint.route('/downloadFile', methods=['GET'])
def downloadFile():
    if request.args.get('document_required') == "electrical_diagram":
        lookup_dictionary = {
            "electrical_diagram": "Project_phase_5",
        }
        data = make_db_call(
            queries["download_file"]
            .replace("table_name", lookup_dictionary[request.args.get('document_required')])
            .replace("document_required", request.args.get('document_required')), 
            "select", 
            parameters={"consumer_number": request.args.get('id')}
            )
        bytestring = bytes(data[0][0])
        bytes_io = BytesIO(bytestring)
        bytes_io.seek(0)
        return send_file(bytes_io, mimetype="application/pdf", download_name=request.args["document_required"], as_attachment=True)

    elif request.args.get('document_required') == "agreement":
        lookup_dictionary = {
            "industrial": "industrial_agreement",
            "residential": "national_portal_residential_agreement",
        }
        
    elif request.args.get('document_required') == "certificate":
        lookup_dictionary = {
            "1": "self certificate 1 page",
            "4": "Self Declaration-Certificate1- ugvcl",
        }

    with open(create_pdf_from_doc(lookup_dictionary[request.args.get("document_type")], request.args), 'rb') as f:
            return send_file(BytesIO(f.read()), mimetype="application/pdf", download_name=request.args["document_required"], as_attachment=True)


@blueprint.route("/upload", methods=["POST"])
def upload():
    print(request.files)
    make_db_call(queries["upload"], "update", parameters={"file": request.files["file"].read(), "consumer_number":"12345"})
    number_of_files = make_db_call(queries["number_of_files"], "select", parameters={"consumer_number": "12345"})
    return {"success": True}

@blueprint.route("/getPanelDetails", methods=["GET"])
def getPanelDetails():
    print(request.args.get("solar_panel_type"))
    panel_data = make_db_call(queries["get_panel_details"], "select", parameters={"solar_panel_type": request.args.get("solar_panel_type")})
    panel_columns = [i for i in make_db_call(queries["get_columns"], "select", parameters={"table_name": "Panel_details"})]
    print("panel_columns", panel_columns)
    return {column[0]: panel_data[0][j] for j, column in enumerate(panel_columns)}
