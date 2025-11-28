/**
 * Comprehensive TypeScript test file for the code chunker.
 * This file contains various TypeScript components to test AST parsing and chunking.
 */

// Standard library imports
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { EventEmitter } from "events";

// Simple UUID generator for testing
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Type definitions
type UserRole = "admin" | "user" | "guest";
type Status = "active" | "inactive" | "pending";

// Interface definitions
interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

interface User extends BaseEntity {
  name: string;
  email: string;
  role: UserRole;
  status: Status;
  metadata?: Record<string, unknown>;
}

interface Product extends BaseEntity {
  name: string;
  price: number;
  description: string;
  category: string;
  inStock: boolean;
}

// Generic interface
interface Repository<T extends BaseEntity> {
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  create(entity: Omit<T, "id" | "createdAt" | "updatedAt">): Promise<T>;
  update(id: string, entity: Partial<T>): Promise<T>;
  delete(id: string): Promise<boolean>;
}

// Type aliases
type ID = string | number;
type Callback<T> = (data: T) => void;
type AsyncFunction<T, R> = (input: T) => Promise<R>;

// Module-level constants
const API_BASE_URL = "https://api.example.com";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const MAX_RETRIES = 3;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const DEFAULT_TIMEOUT = 30000;

// Module-level variables
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const globalCounter = 0;
const appConfig: Record<string, unknown> = {};

// Simple function
function add(a: number, b: number): number {
  return a + b;
}

// Function with default parameters
function greet(name: string = "Guest", age: number = 18): string {
  return `Hello, ${name}! You are ${age} years old.`;
}

// Generic function
function identity<T>(value: T): T {
  return value;
}

// Function with overloads
function processData(input: string): string;
function processData(input: number): number;
function processData(input: string | number): string | number {
  if (typeof input === "string") {
    return input.toUpperCase();
  }
  return input * 2;
}

// Complex function with generics and type constraints
function transformArray<T, R>(
  items: T[],
  transformer: (item: T) => R,
  filter?: (item: T) => boolean
): R[] {
  let filtered = items;
  if (filter) {
    filtered = items.filter(filter);
  }
  return filtered.map(transformer);
}

// Async function
async function fetchUserData(userId: string): Promise<User> {
  try {
    // Simulated API call - in real scenario would use fetch or axios
    const response = await fetch(`${API_BASE_URL}/users/${userId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = (await response.json()) as User;
    return data;
  } catch (error) {
    throw new Error(`Failed to fetch user: ${error}`);
  }
}

// Function with rest parameters
function sum(...numbers: number[]): number {
  return numbers.reduce((acc, num) => acc + num, 0);
}

// Arrow function
const multiply = (a: number, b: number): number => a * b;

// Higher-order function
function createLogger(prefix: string): (message: string) => void {
  return (message: string) => {
    console.log(`[${prefix}] ${message}`);
  };
}

// Simple class
class Person {
  // Class properties
  private _age: number;
  protected name: string;
  public readonly id: string;

  // Constructor
  constructor(name: string, age: number) {
    this.name = name;
    this._age = age;
    this.id = generateId();
  }

  // Getter
  get age(): number {
    return this._age;
  }

  // Setter
  set age(value: number) {
    if (value >= 0) {
      this._age = value;
    }
  }

  // Method
  greet(): string {
    return `Hello, I'm ${this.name} and I'm ${this._age} years old`;
  }

  // Static method
  static fromJSON(json: string): Person {
    const data = JSON.parse(json);
    return new Person(data.name, data.age);
  }

  // Private method
  private validateAge(): boolean {
    return this._age >= 0 && this._age <= 150;
  }
}

// Class with inheritance
class Employee extends Person {
  private employeeId: string;
  public department: string;
  protected salary: number;

  constructor(
    name: string,
    age: number,
    employeeId: string,
    department: string,
    salary: number
  ) {
    super(name, age);
    this.employeeId = employeeId;
    this.department = department;
    this.salary = salary;
  }

  // Override method
  greet(): string {
    return `${super.greet()} and I work in ${this.department}`;
  }

  // New method
  calculateBonus(multiplier: number = 0.1): number {
    return this.salary * multiplier;
  }

  // Protected method
  protected updateSalary(newSalary: number): void {
    if (newSalary > 0) {
      this.salary = newSalary;
    }
  }

  // Abstract-like pattern with interface
  getInfo(): Record<string, unknown> {
    return {
      name: this.name,
      age: this.age,
      employeeId: this.employeeId,
      department: this.department,
      salary: this.salary,
    };
  }
}

// Generic class
class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }
}

// Class implementing interface
class UserRepository implements Repository<User> {
  private users: Map<string, User> = new Map();

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async findAll(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async create(
    entity: Omit<User, "id" | "createdAt" | "updatedAt">
  ): Promise<User> {
    const user: User = {
      ...entity,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  async update(id: string, entity: Partial<User>): Promise<User> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new Error(`User with id ${id} not found`);
    }
    const updated: User = {
      ...existing,
      ...entity,
      updatedAt: new Date(),
    };
    this.users.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    return this.users.delete(id);
  }
}

// Abstract class
abstract class BaseService {
  protected logger: (message: string) => void;

  constructor(serviceName: string) {
    this.logger = createLogger(serviceName);
  }

  abstract process(data: unknown): Promise<unknown>;

  protected log(message: string): void {
    this.logger(message);
  }
}

// Concrete implementation
class UserService extends BaseService {
  private repository: UserRepository;

  constructor() {
    super("UserService");
    this.repository = new UserRepository();
  }

  async process(data: unknown): Promise<User> {
    this.log("Processing user data");
    if (typeof data === "object" && data !== null) {
      return await this.repository.create(data as Omit<User, "id" | "createdAt" | "updatedAt">);
    }
    throw new Error("Invalid user data");
  }

  async getUser(id: string): Promise<User | null> {
    return await this.repository.findById(id);
  }
}

// Enum
enum Color {
  Red = "RED",
  Green = "GREEN",
  Blue = "BLUE",
}

enum StatusCode {
  OK = 200,
  NotFound = 404,
  ServerError = 500,
}

// Namespace
namespace Utils {
  export function formatDate(date: Date): string {
    return date.toISOString();
  }

  export function parseJSON<T>(json: string): T {
    return JSON.parse(json) as T;
  }

  export class Formatter {
    static formatCurrency(amount: number): string {
      return `$${amount.toFixed(2)}`;
    }
  }
}

// Decorator function (simple implementation)
function logMethod(
  target: unknown,
  propertyKey: string,
  descriptor: PropertyDescriptor
): void {
  const originalMethod = descriptor.value;
  descriptor.value = function (...args: unknown[]) {
    console.log(`Calling ${propertyKey} with args:`, args);
    return originalMethod.apply(this, args);
  };
}

// Class with decorator
class Calculator {
  @logMethod
  add(a: number, b: number): number {
    return a + b;
  }

  @logMethod
  subtract(a: number, b: number): number {
    return a - b;
  }
}

// Type guards
function isUser(obj: unknown): obj is User {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "id" in obj &&
    "name" in obj &&
    "email" in obj
  );
}

// Assertion function
function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== "string") {
    throw new Error("Value is not a string");
  }
}

// Conditional types
type NonNullable<T> = T extends null | undefined ? never : T;
type ReturnType<T> = T extends (...args: unknown[]) => infer R ? R : never;

// Mapped types
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Partial<T> = {
  [P in keyof T]?: T[P];
};

// Utility types usage
type UserInput = Omit<User, "id" | "createdAt" | "updatedAt">;
type UserUpdate = Partial<Pick<User, "name" | "email" | "status">>;

// Async generator
async function* asyncGenerator(start: number, end: number): AsyncGenerator<number> {
  for (let i = start; i <= end; i++) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    yield i;
  }
}

// Regular generator
function* numberGenerator(start: number, end: number): Generator<number> {
  for (let i = start; i <= end; i++) {
    yield i;
  }
}

// Function with destructuring
function processUser({ name, email, role }: User): string {
  return `${name} (${email}) - ${role}`;
}

// Function with optional chaining and nullish coalescing
function getUserName(user: User | null | undefined): string {
  return user?.name ?? "Unknown";
}

// Template literal types
type EventName = `on${Capitalize<string>}`;
type CSSValue = `${number}px` | `${number}%` | "auto";

// Const assertions
const config = {
  apiUrl: "https://api.example.com",
  timeout: 30000,
  retries: 3,
} as const;

// Tuple types
type Point = [number, number];
type UserTuple = [string, string, number]; // [name, email, age]

// Union and intersection types
type StringOrNumber = string | number;
type UserWithProduct = User & { product: Product };

// Main execution
async function main(): Promise<void> {
  console.log("TypeScript Chunker Test");

  // Test simple function
  const result = add(5, 3);
  console.log(`Add result: ${result}`);

  // Test class
  const person = new Person("Alice", 25);
  console.log(person.greet());

  // Test employee
  const employee = new Employee("Bob", 30, "EMP001", "Engineering", 75000);
  console.log(employee.greet());
  console.log(`Bonus: $${employee.calculateBonus()}`);

  // Test generic class
  const stack = new Stack<number>();
  stack.push(1);
  stack.push(2);
  stack.push(3);
  console.log(`Stack size: ${stack.size()}`);

  // Test repository
  const userRepo = new UserRepository();
  const user = await userRepo.create({
    name: "Charlie",
    email: "charlie@example.com",
    role: "user",
    status: "active",
  });
  console.log(`Created user: ${user.name}`);

  // Test service
  const userService = new UserService();
  const serviceUser = await userService.process({
    name: "David",
    email: "david@example.com",
    role: "admin",
    status: "active",
  });
  console.log(`Service user: ${serviceUser.name}`);

  // Test utilities
  const formatted = Utils.Formatter.formatCurrency(1234.56);
  console.log(`Formatted: ${formatted}`);

  // Test calculator with decorator
  const calc = new Calculator();
  console.log(`5 + 3 = ${calc.add(5, 3)}`);

  console.log("All tests completed!");
}

// Export statements
export {
  User,
  Product,
  Person,
  Employee,
  UserRepository,
  UserService,
  Stack,
  add,
  greet,
  fetchUserData,
  transformArray,
};

// Default export
export default main;

+hello error

// Conditional execution
if (require.main ==== module) {
  main().catch(console.error);
}
