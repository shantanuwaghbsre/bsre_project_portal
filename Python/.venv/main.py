from flask import Flask, request, make_response
from flask_cors import CORS
from blueprints.quotation_routes import blueprint as quotation_routes_blueprint
from blueprints.consumer_routes import blueprint as consumer_routes_blueprint
from blueprints.project_routes import blueprint as project_routes_blueprint
from blueprints.agent_routes import blueprint as agent_routes_blueprint
import waitress
app = Flask(__name__)
CORS(app)

app.register_blueprint(quotation_routes_blueprint)
app.register_blueprint(consumer_routes_blueprint)
app.register_blueprint(project_routes_blueprint)
app.register_blueprint(agent_routes_blueprint)

@app.before_request
def before_request():
    if request.method == "OPTIONS":
        response = make_response("OK", 200)
        response.headers['Access-Control-Request-Headers'] = 'Token'
        return response
    # if "Token" in request.headers:
        # response = requests.post("http://192.168.29.62:8080/realms/myrealm/protocol/openid-connect/token/introspect", data={"token": request.headers.get("Token"), "token_type_hint": "access_token", "client_id": "b_client", "client_secret": os.getenv('CLIENT_SECRET')}, headers={"Content-Type": "application/x-www-form-urlencoded"})
    #     if not response.json()["active"]:
    #         print("from 1")
    #         return "Unauthorized", 401
    # else:
    #     print("from 2")
    #     return "Unauthorized", 401

if __name__ == '__main__':
    #waitress.serve(app=app, host="0.0.0.0", port=5000)
    app.run(debug=True, host='0.0.0.0', port=5000, threaded=True)


