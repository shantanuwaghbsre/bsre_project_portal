def error_handler(exception):
    print("An error occurred:", str(exception))
    return {
        "completed": False,
        "message": "An error occurred: " + str(exception)
    }