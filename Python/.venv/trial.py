class Car():
    def __init__(self, name=None):
        self.name = name
    
    def get_top_speed(self):
        obj = requests.get("enter some url here")
        top_speed = obj.calculate_top_speed()
        engine_details = requests.get("enter some url here")
        list_of_features = []
        for feature in engine_details.get_features():
            list_of_features += feature.name.title 
        if len(engine_details.get_features()) == 6:

            if engine_details.name == "solenoid":
                top_speed /= 2
                return set_safety_rating(self, top_speed, engine_details, list_of_features)
            else:
                safety_rating = set_safety_rating(self, top_speed, engine_details, list_of_features)
                top_speed = float(top_speed)*safety_rating
                return safety_rating
        else:
            return set_safety_rating(self, top_speed, engine_details, list_of_features[0:1])
    
    def set_safety_rating(self, top_speed, engine_details, list_of_features):
        # do some stuff with inputs and return safety rating
        pass


class MockFeature:
    def __init__(self, name):
        self.name = name
        self.title = "Some Title"
    
a = MockFeature("abcd")

print(a.name.title)


        