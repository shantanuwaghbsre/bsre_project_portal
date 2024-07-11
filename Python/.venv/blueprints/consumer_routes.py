from flask import Blueprint, Flask, request, jsonify, send_file
import datetime
from datetime import timezone
from io import BytesIO
from pdf_management_helper import create_encrypted_pdf_from_html, create_html_from_template, create_bar_graph, create_line_graph
from mailer import mail_to_consumer
import os
from dotenv import load_dotenv
load_dotenv()
import json
import re
import base64

#For Vercel
from ..service import make_db_call

#For Local
# from service import make_db_call

# Create a Blueprint object
blueprint = Blueprint('consumer_routes', __name__)
file_path = os.path.abspath(os.getcwd()) + "/Python/.venv/queries/queries_for_consumers.json"

try:
    if os.path.exists(file_path):
        with open(file_path, 'r') as file:
            queries = json.load(file)
    else:
        print("File does not exist.")
except Exception as e:
    print("An error occurred:", str(e))


@blueprint.route('/onboardConsumer', methods=['POST'])
def onboardConsumer():

    print({
            "other_document":[file.name for file in request.files.values() if file.name not in ["aadharCard", "passportPhoto", "panCard"]],
    "other_document_names":[file.filename for file in request.files.values() if file.name not in ["aadharCard", "passportPhoto", "panCard"]]
    })

    consumer_id = make_db_call(queries["insert_consumer"], type_="returns", 
    parameters={
    "consumer_name":request.form["consumerName"],
    "consumer_address":request.form["consumerAddress"],
    "consumer_mobile_number":request.form["consumerMobileNumber"],
    "alternate_phone_number":request.form["alternatePhoneNumber"],
    "consumer_email":request.form["consumerEmail"],
    "aadhar_card_number":request.form["aadharCardNumber"],
    "pan_card_number":request.form["panCardNumber"],
    "onboarded_by_agent_code":request.form["onboardedByAgentCode"],
    "aadhar_card":request.files["aadharCard"].read(),
    "passport_photo":request.files["passportPhoto"].read(),
    "pan_card":request.files["panCard"].read(),
    "other_documents":[file.read() for file in request.files.values() if file.name not in ["aadharCard", "passportPhoto", "panCard"]],
    "other_documents_names":[file.filename for file in request.files.values() if file.name not in ["aadharCard", "passportPhoto", "panCard"]]
    })

    print(consumer_id)

    return {"success": True, "consumer_id": consumer_id[0][0]}

@blueprint.route('/getConsumerDocuments', methods=['GET'])
def getConsumerDocuments():
    if not re.match(r'^[a-z_]+$', request.args["document_required"]):
        raise ValueError("Document name should only contain alphabets and underscores.")
    data = make_db_call(queries["get_document"].replace("$document_name", request.args["document_required"]), 'returns', parameters={"document_required": request.args["document_required"], "consumer_id": request.args["id"]})
    return {"document": base64.b64encode(bytes(data[0][0])).decode('utf-8')}

@blueprint.route('/getConsumerDetails', methods=['GET'])
def getConsumerDetails():
    return make_db_call(queries["get_consumer_details"], 'returns', parameters={"consumer_id": request.args["consumer_id"]})[0][0]

@blueprint.route('/getAllConsumers', methods=['GET'])
def getAllConsumers():
    
    page = int(request.args.get('page'))
    limit = int(request.args.get('limit'))
    
    search_by = request.args.get('searchDropdown')
    search_term = request.args.get('searchTerm')
    print(page, limit, search_by, search_term)
    # Calculate the total number of pages based on the limit
    count = 0
    if search_by == 'consumer_name' and search_term:
        # Get the consumers for the current page
        consumers_list = make_db_call(queries["get_all_consumers_list"].replace("##where##", f' WHERE {search_by} ilike %(' + 'search_for' + ')s'), type_='returns', parameters={"lower": (limit*(page-1)), "limit": limit, "search_for": '%' + search_term + '%'})
        # Calculate the total number of pages based on the limit
        count = make_db_call(query=queries['countPages'].replace("##where##", f' WHERE {search_by} ilike %(' + 'search_for' + ')s'), type_='returns', parameters={"search_for": '%' + search_term + '%'})[0][0]
        if count == None:
            count = 0
    else:
        # Get the consumers for the current page
        consumers_list = make_db_call(queries["get_all_consumers_list"].replace("##where##", ''), 'returns', parameters={"lower": (limit*(page-1)), "limit": limit})
        # Calculate the total number of pages based on the limit
        count = make_db_call(query=queries['countPages'].replace("##where##", ''), type_='returns')[0][0]
    # Check if there are no consumers for the current page
    if consumers_list == [[None]]:
        # Return an empty list of consumers and total pages as 0
        return {"consumers": [], "count": 0}
    
    # Process the consumers query results and create a list of consumers
    consumers = []

    for row in consumers_list:
        # Create a dictionary for each consumer with the specified fields
        consumer = {}
        for i in range(len(row)):
            if type(row[i]) == memoryview:
                consumer[queries['get_all_consumers_column_names'][i]] = base64.b64encode(row[i]).decode('utf-8')
                continue
            elif queries['get_all_consumers_column_names'][i] == 'other_documents':
                if row[i] is not None:
                    consumer[queries['get_all_consumers_column_names'][i]] = [base64.b64encode(file).decode('utf-8') for file in row[i]]
                else:
                    consumer[queries['get_all_consumers_column_names'][i]] = []
                continue
            consumer[queries['get_all_consumers_column_names'][i]] = row[i] if row[i] else None

        # Add the consumer to the list
        consumers.append(consumer)

    # Create the response dictionary with the consumers and total pages
    response = {
        "consumers": consumers,
        "count": count
    }
    # Return the response
    return response

@blueprint.route('/getConsumer', methods=['GET'])
def getConsumer():
    row = make_db_call(queries["get_consumer"], 'returns', parameters={"consumer_id": request.args["consumer_id"]})[0]
    print(row)
    consumer = {}
    for i in range(len(row)):
        if type(row[i]) == memoryview:
            consumer[queries['get_all_consumers_column_names'][i]] = base64.b64encode(row[i]).decode('utf-8')
            continue
        elif queries['get_all_consumers_column_names'][i] == 'other_documents':
            if row[i] is not None and len(row[i]) > 0:
                print(file for file in row[i])
                consumer[queries['get_all_consumers_column_names'][i]] = [base64.b64encode(file).decode('utf-8') for file in row[i]]
            else:
                consumer[queries['get_all_consumers_column_names'][i]] = []
            continue
        consumer[queries['get_all_consumers_column_names'][i]] = row[i] if row[i] else None

    return consumer