require('dotenv').config();
console.log('Connected to database:', process.env.DB_NAME);

const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

// Create a new Sequelize instance connecting to the 'mydb' database.
const sequelize = new Sequelize(
  process.env.DB_NAME, // should be 'mydb'
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    port: process.env.DB_PORT || 3306,
    logging: false,
  }
);

// Define the Puppy model that maps to the existing 'puppies' table.
const Puppy = sequelize.define("Puppy", {
  pet_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  breed: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  age_est: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  current_kennel_number: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'puppies', // use the existing table 'puppies'
  timestamps: false,
});

// Instead of calling Puppy.sync(), we manually check if the table exists.
// This prevents Sequelize from creating or altering the table.

console.log("Connected to database:", process.env.mydb);


sequelize.getQueryInterface().describeTable('puppies')
  .then(() => {
    console.log("✅ Table 'puppies' exists. Continuing...");
  })
  .catch((err) => {
    console.error("❌ Table 'puppies' does not exist:", err);
    throw new Error("Required table 'puppies' not found in the database.");
  });

module.exports = { Puppy, sequelize };
