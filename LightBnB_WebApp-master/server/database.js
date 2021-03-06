const { Pool } = require('pg')

const properties = require('./json/properties.json');
const users = require('./json/users.json');
require('dotenv').config();

const dbPool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});
/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */


// const getUserWithEmail = function(email) {
//   let user;
//   for (const userId in users) {
//     user = users[userId];
//     if (user.email.toLowerCase() === email.toLowerCase()) {
//       break;
//     } else {
//       user = null;
//     }
//   }
//   return Promise.resolve(user);
// }
// exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
// const getUserWithId = function(id) {
//   return Promise.resolve(users[id]);
// }
// exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
// const addUser =  function(user) {
//   const userId = Object.keys(users).length + 1;
//   user.id = userId;
//   users[userId] = user;
//   return Promise.resolve(user);
// }
// exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
// const getAllReservations = function(guest_id, limit = 10) {
//   return getAllProperties(null, 2);
// }
// exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
// const getAllProperties = function(options, limit = 10) {
//   const limitedProperties = {};
//   for (let i = 1; i <= limit; i++) {
//     limitedProperties[i] = properties[i];
//   }
//   return Promise.resolve(limitedProperties);
// }
// exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;


// Function with queries in db ===========


const getUserWithEmail = function(email) {
  return dbPool.query(`
  SELECT * FROM users
  WHERE  email = $1
  `, [email])
  .then(res => res.rows[0]);
}
exports.getUserWithEmail = getUserWithEmail;

const getUserWithId = function(id) {
  return dbPool.query(`
  SELECT id FROM users
  WHERE  id = $1
  `, [id])
  .then(res => res.rows[0]);
}
exports.getUserWithId = getUserWithId;

const addUser =  function(user) {
  return dbPool.query(`
  INSERT INTO users (name,email,password)
  VALUES ($1,$2,$3)
  `, [user.name,user.email,user.password])
  .then(res => res.rows);
}
exports.addUser = addUser;

const getAllReservations = function(guest_id, limit = 10) {
  return dbPool.query(`
  SELECT reservations.*,properties.*
  FROM reservations
  JOIN properties ON reservations.property_id = properties.id
  JOIN property_reviews ON properties.id = property_reviews.property_id 
  WHERE reservations.guest_id = $1
  AND reservations.end_date < now()::date
  GROUP BY properties.id, reservations.id
  ORDER BY reservations.start_date
  LIMIT $2
  `, [guest_id,limit])
  .then(res => res.rows);
}
exports.getAllReservations = getAllReservations;


// tristanjacobs@gmail.com

// const getAllProperties = function(options, limit = 10) {
//   console.log(options);
//   return dbPool.query(`
//   SELECT * FROM properties
//   LIMIT $1
//   `, [limit])
//   .then(res => res.rows);
// }
// exports.getAllProperties = getAllProperties;

const getAllProperties = function(options, limit = 10) {
  console.log("options",options);
  // 1
  const queryParams = [];
  // 2
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;
  if (options.id) {
    queryParams.push(parseInt(options.id));
    queryString += `WHERE owner_id = $${queryParams.length}`;
  }
  // 3
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE LOWER(city) LIKE LOWER($${queryParams.length})`;
  }
  if (options.minimum_price_per_night) {
    queryParams.push(parseInt(options.minimum_price_per_night));
    queryString += `AND cost_per_night > $${queryParams.length} `;
  }
  
  if (options.maximum_price_per_night) {
    queryParams.push(parseInt(options.maximum_price_per_night));
    queryString += `AND cost_per_night < $${queryParams.length}`;
  }
  if (options.minimum_rating) {
    queryParams.push(parseInt(options.minimum_rating));
    queryString += `AND property_reviews.rating > $${queryParams.length} `;
  }
// to_number("${queryParams[queryParams.length-1]}",
// '99G999D9S') `;
  // 4

  queryString +=`
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT ${limit};
  `;

  // 5
  console.log(queryString, queryParams);

  // 6
  return dbPool.query(queryString, queryParams)
  .then(res => res.rows);
}
exports.getAllProperties = getAllProperties;