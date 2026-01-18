import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcome } from './nx-welcome';

/**
 * Adds two numbers together
 * @param a First number
 * @param b Second number
 * @returns Sum of a and b
 */
export function add(a: number, b: number): number {
  return a + b;
}

/**
 * Multiplies two numbers
 * @param a First number
 * @param b Second number
 * @returns Product of a and b
 */
export function multiply(a: number, b: number): number {
  return a * b;
}

/**
 * Checks if a string is empty or whitespace
 * @param str String to check
 * @returns True if string is empty or contains only whitespace
 */
export function isEmptyString(str: string): boolean {
  return !str || str.trim().length === 0;
}

/**
 * Capitalizes the first letter of a string
 * @param str String to capitalize
 * @returns String with first letter capitalized
 */
export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

@Component({
  imports: [NxWelcome, RouterModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'tia-frontend';

  /**
   * Gets a greeting message
   * @param name Name to greet
   * @returns Greeting message
   */
  getGreeting(name: string): string {
    return `Hello, ${capitalize(name)}!`;
  }

  /**
   * Calculates the sum of an array of numbers
   * @param numbers Array of numbers
   * @returns Sum of all numbers
   */
  calculateSum(numbers: number[]): number {
    return numbers.reduce((sum, num) => add(sum, num), 0);
  }
}
