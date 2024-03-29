from dotenv import load_dotenv
load_dotenv()
import os
import psycopg2
from typing import Optional, List, Any, Union, Tuple

def set_cursor():
    # Establish a connection to the database
    conn = psycopg2.connect(
        database=os.environ.get("DATABASE"),
        user=os.environ.get("USER"),
        host=os.environ.get("HOST"),
        password=os.environ.get("PASSWORD"),
        port=os.environ.get("PORT")
    )

    # Create a cursor object for executing SQL queries
    return conn.cursor()

cur = set_cursor()

def make_db_call(query: str, type_: str, parameters: Optional[List[Any]] = None) -> Union[List[Tuple[Any]], bool]:
    """
    Execute a database query.

    Args:
        query: The SQL query to execute.
        type_: The type of query. Must be either "select" or any other value.
        parameters: Optional parameters to pass to the query.

    Returns:
        If the query type is "select", returns a list of tuples containing the query results.
        If the query type is any other value, returns True.

    Raises:
        ValueError: If the query execution fails.
    """
    if cur.closed:
        cur = set_cursor()

    # Execute the query
    try:
        print(query, parameters)
        cur.execute(query, parameters)
        conn.commit()

        if type_ == "returns":
            try:
                data = cur.fetchall()
            except psycopg2.ProgrammingError as e:
                data = [[None]]
            if not data:
                data = [[None]]
            return data
        else:
            return True

    except Exception as e:
        cur.execute("ROLLBACK")
        conn.commit()
        raise e or ValueError("Could not perform query")

# print(make_db_call('select column_name from information_schema.columns where table_name = %(table_name)s', 'select', parameters={'table_name': 'Project_phase_2'}))