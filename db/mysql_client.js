/**
 * MySQL Connection Helper
 * 
 * Reusable MySQL connection for local development
 * 
 * Usage:
 *   import { getConnection, query } from './db/mysql_client.js';
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const MYSQL_CONFIG = {
  host: process.env.MYSQL_HOST || '127.0.0.1',
  port: parseInt(process.env.MYSQL_PORT || '3306'),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'portfolio_local',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let pool;

/**
 * Get MySQL connection pool
 */
export function getPool() {
  if (!pool) {
    pool = mysql.createPool(MYSQL_CONFIG);
  }
  return pool;
}

/**
 * Get a single connection from the pool
 */
export async function getConnection() {
  const pool = getPool();
  return await pool.getConnection();
}

/**
 * Execute a query
 * @param {string} sql - SQL query
 * @param {Array} params - Query parameters
 * @returns {Promise<Array>} Query results
 */
export async function query(sql, params = []) {
  const pool = getPool();
  const [rows] = await pool.execute(sql, params);
  return rows;
}

/**
 * Execute multiple queries in a transaction
 * @param {Function} callback - Async function that receives connection
 * @returns {Promise} Result of callback
 */
export async function transaction(callback) {
  const connection = await getConnection();
  
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * Close all connections (call on app shutdown)
 */
export async function closePool() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

/**
 * Test database connection
 */
export async function testConnection() {
  try {
    const connection = await getConnection();
    await connection.ping();
    connection.release();
    return true;
  } catch (error) {
    console.error('MySQL connection test failed:', error.message);
    return false;
  }
}

// Example usage:
/*
import { query, transaction } from './db/mysql_client.js';

// Simple query
const projects = await query('SELECT * FROM portfolio_projects WHERE is_featured = ?', [1]);

// Transaction
await transaction(async (conn) => {
  await conn.execute('INSERT INTO portfolio_projects (...) VALUES (...)', [...]);
  await conn.execute('UPDATE portfolio_skills SET ...', [...]);
});
*/
