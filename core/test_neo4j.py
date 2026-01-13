from neo4j import GraphDatabase

uri = "bolt://127.0.0.1:7687"
user = "neo4j"
password = "Password!0"

def test_connection():
    try:
        driver = GraphDatabase.driver(uri, auth=(user, password))
        with driver.session() as session:
            result = session.run("RETURN 1 as result")
            record = result.single()
            print(f"Connection successful: {record['result']}")
        driver.close()
    except Exception as e:
        print(f"Connection failed: {e}")

if __name__ == "__main__":
    test_connection()
