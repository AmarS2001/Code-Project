"""
This is a comprehensive test file for the code chunker.
It contains various Python components to test AST parsing and chunking.
"""

# Standard library imports
import os
import sys
from typing import List, Dict, Optional, Union
from datetime import datetime
from pathlib import Path

# Third-party imports
import requests
import json

# Module-level constants
API_BASE_URL = "https://api.example.com"
MAX_RETRIES = 3
DEFAULT_TIMEOUT = 30

# Module-level variables
global_counter = 0
config_data = {}
initialized = False


def simple_function(x: int, y: int) -> int:
    """Simple function that adds two numbers.
    
    Args:
        x: First number
        y: Second number
    
    Returns:
        Sum of x and y
    """
    return x + y


def function_with_defaults(name: str = "Guest", age: int = 18) -> str:
    """Function with default parameters."""
    return f"{name} is {age} years old"


def complex_function(
    items: List[str],
    config: Dict[str, any],
    callback: Optional[callable] = None
) -> Union[List[str], None]:
    """
    Complex function with multiple parameters and type hints.
    
    This function processes a list of items with configuration.
    """
    results = []
    
    # Process each item
    for item in items:
        if callback:
            processed = callback(item)
            results.append(processed)
        else:
            results.append(item.upper())
    
    return results if results else None


def function_with_control_flow(data: List[int]) -> Dict[str, int]:
    """Function demonstrating control flow structures."""
    stats = {"sum": 0, "max": 0, "min": float('inf'), "count": 0}
    
    # If-else logic
    if not data:
        return stats
    
    # Loop with conditions
    for num in data:
        if num > stats["max"]:
            stats["max"] = num
        if num < stats["min"]:
            stats["min"] = num
        stats["sum"] += num
        stats["count"] += 1
    
    # Try-except block
    try:
        stats["average"] = stats["sum"] / stats["count"]
    except ZeroDivisionError:
        stats["average"] = 0
    
    return stats


# Simple class definition
class Person:
    """Represents a person with basic information."""
    
    # Class variable
    species = "Homo sapiens"
    
    def __init__(self, name: str, age: int, email: Optional[str] = None):
        """Initialize a Person instance.
        
        Args:
            name: Person's full name
            age: Person's age
            email: Optional email address
        """
        self.name = name
        self.age = age
        self.email = email
        self._private_field = "hidden"
    
    def greet(self) -> str:
        """Return a greeting message."""
        return f"Hello, I'm {self.name} and I'm {self.age} years old"
    
    def get_info(self) -> Dict[str, any]:
        """Get person information as dictionary."""
        return {
            "name": self.name,
            "age": self.age,
            "email": self.email
        }
    
    @property
    def is_adult(self) -> bool:
        """Check if person is an adult."""
        return self.age >= 18
    
    @staticmethod
    def from_dict(data: Dict[str, any]) -> 'Person':
        """Create Person instance from dictionary."""
        return Person(
            name=data.get("name", ""),
            age=data.get("age", 0),
            email=data.get("email")
        )


# Complex class with inheritance
class Employee(Person):
    """Represents an employee, extending Person."""
    
    def __init__(
        self,
        name: str,
        age: int,
        employee_id: str,
        department: str,
        salary: float,
        email: Optional[str] = None
    ):
        """Initialize an Employee instance.
        
        Args:
            name: Employee's name
            age: Employee's age
            employee_id: Unique employee identifier
            department: Department name
            salary: Annual salary
            email: Optional email address
        """
        super().__init__(name, age, email)
        self.employee_id = employee_id
        self.department = department
        self.salary = salary
        self._performance_score = 0.0
    
    def calculate_bonus(self, multiplier: float = 0.1) -> float:
        """Calculate bonus based on salary and multiplier.
        
        Args:
            multiplier: Bonus multiplier (default 0.1 = 10%)
        
        Returns:
            Calculated bonus amount
        """
        return self.salary * multiplier
    
    def update_performance(self, score: float) -> None:
        """Update employee performance score.
        
        Args:
            score: Performance score (0.0 to 1.0)
        """
        if 0.0 <= score <= 1.0:
            self._performance_score = score
        else:
            raise ValueError("Performance score must be between 0.0 and 1.0")
    
    def get_performance(self) -> float:
        """Get current performance score."""
        return self._performance_score
    
    def promote(self, new_department: str, salary_increase: float) -> None:
        """Promote employee to new department with salary increase."""
        self.department = new_department
        self.salary += salary_increase
    
    @classmethod
    def create_manager(cls, name: str, age: int, employee_id: str) -> 'Employee':
        """Create a manager employee with default settings."""
        return cls(
            name=name,
            age=age,
            employee_id=employee_id,
            department="Management",
            salary=100000.0
        )


# Class with decorators and special methods
class DataProcessor:
    """Processes data with various operations."""
    
    def __init__(self, data: List[any]):
        """Initialize with data list."""
        self.data = data
        self.processed_count = 0
    
    def __len__(self) -> int:
        """Return length of data."""
        return len(self.data)
    
    def __getitem__(self, index: int) -> any:
        """Get item by index."""
        return self.data[index]
    
    def __str__(self) -> str:
        """String representation."""
        return f"DataProcessor with {len(self.data)} items"
    
    def __repr__(self) -> str:
        """Developer representation."""
        return f"DataProcessor(data={self.data})"
    
    @property
    def is_empty(self) -> bool:
        """Check if processor has no data."""
        return len(self.data) == 0
    
    def process(self, operation: callable) -> List[any]:
        """Process all data with given operation."""
        results = []
        for item in self.data:
            try:
                result = operation(item)
                results.append(result)
                self.processed_count += 1
            except Exception as e:
                print(f"Error processing item: {e}")
                continue
        return results
    
    def filter(self, predicate: callable) -> 'DataProcessor':
        """Filter data and return new processor."""
        filtered = [item for item in self.data if predicate(item)]
        return DataProcessor(filtered)
    
    def map(self, transform: callable) -> 'DataProcessor':
        """Transform data and return new processor."""
        transformed = [transform(item) for item in self.data]
        return DataProcessor(transformed)


# Nested class example
class OuterClass:
    """Outer class containing nested class."""
    
    class InnerClass:
        """Nested inner class."""
        
        def __init__(self, value: int):
            """Initialize inner class."""
            self.value = value
        
        def get_value(self) -> int:
            """Get inner value."""
            return self.value
    
    def __init__(self):
        """Initialize outer class."""
        self.inner = OuterClass.InnerClass(42)


# Function with lambda and comprehensions
def advanced_python_features(numbers: List[int]) -> Dict[str, List[int]]:
    """Demonstrate advanced Python features."""
    
    # List comprehension
    evens = [n for n in numbers if n % 2 == 0]
    
    # Dictionary comprehension
    squares = {n: n**2 for n in numbers}
    
    # Set comprehension
    unique = {n % 10 for n in numbers}
    
    # Lambda functions
    doubled = list(map(lambda x: x * 2, numbers))
    
    # Filter with lambda
    filtered = list(filter(lambda x: x > 10, numbers))
    
    # Generator expression
    generator = (n * 3 for n in numbers if n > 5)
    generated = list(generator)
    
    return {
        "evens": evens,
        "squares_keys": list(squares.keys()),
        "unique_remainders": list(unique),
        "doubled": doubled,
        "filtered": filtered,
        "generated": generated
    }


# Async function example
async def async_function(url: str) -> Dict[str, any]:
    """Async function to fetch data."""
    import aiohttp
    
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            data = await response.json()
            return data


# Context manager example
class FileHandler:
    """Context manager for file operations."""
    
    def __init__(self, filename: str, mode: str = 'r'):
        """Initialize file handler."""
        self.filename = filename
        self.mode = mode
        self.file = None
    
    def __enter__(self):
        """Enter context manager."""
        self.file = open(self.filename, self.mode)
        return self.file
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        """Exit context manager."""
        if self.file:
            self.file.close()
        return False


# Main execution block
if __name__ == "__main__":
    # Test simple function
    result = simple_function(5, 3)
    print(f"Simple function result: {result}")
    
    # Test class instantiation
    person = Person("Alice", 25, "alice@example.com")
    print(person.greet())
    print(f"Is adult: {person.is_adult}")
    
    # Test employee class
    employee = Employee(
        name="Bob",
        age=30,
        employee_id="EMP001",
        department="Engineering",
        salary=75000.0
    )
    print(f"Employee: {employee.greet()}")
    print(f"Bonus: ${employee.calculate_bonus():.2f}")
    
    # Test data processor
    processor = DataProcessor([1, 2, 3, 4, 5])
    doubled = processor.map(lambda x: x * 2)
    print(f"Doubled data: {doubled.data}")
    
    # Test advanced features
    numbers = [1, 2, 3, 4, 5, 15, 20, 25]
    features = advanced_python_features(numbers)
    print(f"Advanced features: {features}")
    
    print("All tests completed successfully!")
