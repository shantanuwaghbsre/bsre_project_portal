from flask import Blueprint, Flask, request, jsonify
from service import make_db_call
import datetime
from datetime import timezone
import pytz
from pdf_management_helper import create_encrypted_pdf_from_html, create_html_from_template


# Create a Blueprint object
blueprint = Blueprint('quotation_routes', __name__)


ist = pytz.timezone('Asia/Kolkata')
gmt = pytz.timezone('GMT')

queries = {
    "add_agent":"INSERT INTO public.'Agents'(agent_name, agent_mobile_number, agent_address, agent_state) VALUES (%s,%s,%s,%s);",
    "get_discom_charges":'''select total_amount from public."DISCOM_charges" where 	(system_capacity_upper_limit is not null
	and system_capacity_lower_limit < %(totalKiloWatts)s and %(totalKiloWatts)s <= system_capacity_upper_limit)	or	(system_capacity_upper_limit is null
	and system_capacity_lower_limit < %(totalKiloWatts)s);''',
    "get_torrent_charges":'''select charge from public."Torrent_charges" where 	(system_capacity_upper_limit is not null
	and system_capacity_lower_limit < %(totalKiloWatts)s and %(totalKiloWatts)s <= system_capacity_upper_limit and phase like %(phase)s)	or	(system_capacity_upper_limit is null
	and system_capacity_lower_limit < %(totalKiloWatts)s and phase like %(phase)s);''',
    "get_guvnl_charges": '''SELECT guvnl_price FROM public."Residential_GUVNL_prices" where number_of_panels=%(numberOfPanels)s and type_of_structure like %(structure)s and kilowatts=%(totalKiloWatts)s;''',
    "get_last_quotation_number":'''select quotation_number from public."Quotations" where quotation_number like %(location)s order by timestamp desc limit 1''',
    "get_agents": '''SELECT agent_code, agent_name, agent_mobile_number, agent_address, agent_state FROM public."Agents";''',
    "insert_quotation": """INSERT INTO "Quotations" ( quotation_number, consumer_mobile_number, consumer_email, consumer_address, timestamp, solar_module_wattage, total_kilowatts, number_of_panels, subsidy, guvnl_amount, net_guvnl_system_price, discom_or_torrent_charges, discom_or_torrent, phase, installation_ac_mcb_switch_charges, geb_agreement_fees, project_cost, quotation_type, agent_name, agent_code, state_or_territory, structure, mounting_quantity, mounting_description, mounting_structure_make, solar_inverter_make, solar_panel_type, solar_module_name, consumer_name) VALUES ( %(quotation_number)s, %(consumer_mobile_number)s, %(consumer_email)s, %(consumer_address)s, %(timestamp)s, %(solar_module_wattage)s, %(total_kilowatts)s, %(number_of_panels)s, %(subsidy)s, %(guvnl_amount)s, %(net_guvnl_system_price)s, %(discom_or_torrent_charges)s, %(discom_or_torrent)s, %(phase)s, %(installation_ac_mcb_switch_charges)s, %(geb_agreement_fees)s, %(project_cost)s, %(quotation_type)s, %(agent_name)s, %(agent_code)s, %(state_or_territory)s, %(structure)s, %(mounting_quantity)s, %(mounting_description)s, %(mounting_structure_make)s, %(solar_inverter_make)s, %(solar_panel_type)s, %(solar_module_name)s, %(consumer_name)s);""",
    "getAllQuotations" : """select * from public."Quotations" order by timestamp desc limit %(limit)s offset %(lower)s""",
    "countPages" : '''select count(*) from public."Quotations"''',
}


@blueprint.route('/calculate', methods=['POST'])
def calculate():

    response = {
      "subsidy" : 0,
      "discom_or_torrent_charges" : 0,
      "guvnl_amount": 0
      }

    if request.json['totalKiloWatts'] and request.json['totalKiloWatts'] <= 3 :
      response["subsidy"] = 14588*request.json['totalKiloWatts']
    elif request.json['totalKiloWatts'] > 3 and request.json['totalKiloWatts'] <= 10:
      response["subsidy"] = (14588*3) + ((request.json['totalKiloWatts'] - 3) * 7294)
    else:
      response["subsidy"] = 94822
    response["subsidy"] = round(response["subsidy"])

    if request.json['discomOrTorrent'].lower() == "discom" and request.json['phase'].lower() == "three":
      response["discom_or_torrent_charges"] = 4910
    elif request.json['discomOrTorrent'].lower() == "discom":
      response["discom_or_torrent_charges"] = make_db_call(query=queries['get_discom_charges'], parameters={"totalKiloWatts":request.json['totalKiloWatts']}, type_="select")[0][0]
    elif request.json['discomOrTorrent'].lower() == "torrent":
      response["discom_or_torrent_charges"] = make_db_call(query=queries['get_torrent_charges'], parameters={"totalKiloWatts":request.json['totalKiloWatts'], "phase":request.json['phase'].lower()}, type_="select")[0][0]

    response['guvnl_amount'] = make_db_call(query=queries['get_guvnl_charges'], parameters={"numberOfPanels":request.json['numberOfPanels'], "structure":request.json['structure'], "totalKiloWatts":request.json['totalKiloWatts']}, type_="select")[0][0]
    print(response)
    return response   


@blueprint.route('/getAgents', methods=['GET'])
def getAgents():
  response = []
  for agent_details in make_db_call(query=queries['get_agents'], type_="select"):
      response.append({
        "agent_id": agent_details[0],
        "agent_name": agent_details[1],
        "agent_mobile_number": str(agent_details[2]),
        "agent_address": agent_details[3],
        "agent_state": agent_details[4]
      })
  return response

@blueprint.route('/submitQuotation', methods=['POST'])
def submitQuotation():

  response = {}
  last_quotation = make_db_call(query=queries['get_last_quotation_number'], parameters={"location":request.json["agent_code"][:3]+'%'}, type_="select")[0][0]
  quotation_number = request.json['agent_code'][:3] + '/' + datetime.datetime.now().strftime("%d%m%y") + "/" 
  if last_quotation:
    if last_quotation[4:10] == datetime.datetime.now().strftime("%d%m%y"):
        quotation_number += f"{int(last_quotation[11:15])+1:04d}"
    else:
      quotation_number += f"{1:04d}" 
  else:
      quotation_number += f"{1:04d}"

  request.json["quotation_number"] = quotation_number
  request.json["timestamp"] = datetime.datetime.now()
  
  response["completed"] = make_db_call(query=queries['insert_quotation'], parameters=request.json, type_="insert")
  if response["completed"]:
    response["quotation_number"] = quotation_number

  html_file_path = create_html_from_template(request.json)
  create_encrypted_pdf_from_html(html_file_path, request.json)
  mail_to_consumer(request.json)

  return response
  
@blueprint.route('/getAllQuotations', methods=['GET'])
def getAllQuotations():
  response = {
    "quotations": [],
    "totalPages": 0
  }
  page = int(request.args.get('page'))
  limit = int(request.args.get('limit'))

  response['totalPages'] = int(int(make_db_call(query=queries['countPages'], type_='select')[0][0])/limit) + 1
  raw_quotations = make_db_call(query=queries['getAllQuotations'], type_="select", parameters={"lower": (limit*(page-1)), "limit": limit})
  if raw_quotations != [[None]]:
    response["quotations"] = [{"Quotation number":quotation_number, "Consumer mobile number":consumer_mobile_number, "Consumer address":consumer_address, "Solar module wattage":solar_module_wattage, "Total kilowatts":total_kilowatts, "Number of panels":number_of_panels, "Subsidy":subsidy, "GUVNL amount":guvnl_amount, "Net GUVNL system price":net_guvnl_system_price, "DISCOM/Torrent charges":discom_or_torrent_charges, "DISCOM/Torrent":discom_or_torrent, "Phase":phase, "Installation AC MCB switch charges":installation_ac_mcb_switch_charges, "GEB agreement fees":geb_agreement_fees, "Project cost":project_cost, "Quotation type":quotation_type, "Agent name":agent_name, "State or territory":state_or_territory, "Structure":structure, "Mounting quantity":mounting_quantity, "Mounting description":mounting_description, "Mounting structure make":mounting_structure_make, "Solar inverter make":solar_inverter_make, "Solar panel type":solar_panel_type, "Solar module name":solar_module_name, "Consumer name":consumer_name, "Timestamp":gmt.localize(timestamp).astimezone(ist), "Agent code":agent_code, "Consumer email":consumer_email} for quotation_number, consumer_mobile_number, consumer_address, solar_module_wattage, total_kilowatts, number_of_panels, subsidy, guvnl_amount, net_guvnl_system_price, discom_or_torrent_charges, discom_or_torrent, phase, installation_ac_mcb_switch_charges, geb_agreement_fees, project_cost, quotation_type, agent_name, state_or_territory, structure, mounting_quantity, mounting_description, mounting_structure_make, solar_inverter_make, solar_panel_type, solar_module_name, consumer_name, timestamp, agent_code, consumer_email in raw_quotations]
  return response