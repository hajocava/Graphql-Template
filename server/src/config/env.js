process.env.PORT = process.env.PORT || 4000 // Port express

process.env.EXPTOKEN = "3d" // Time live valid tokens 3 days
process.env.SEED = process.env.SEED || 'No, I am your father' // Seed SECRET encrypt token

// Configuration MongoDB
process.env.DBNAME = process.env.DBNAME || 'myDataBase';
process.env.DBHOST = process.env.DBHOST || 'localhost';
process.env.DBUSER = process.env.DBUSER || 'user';
process.env.DBPASS = process.env.DBPASS || '';
process.env.DBPORT = process.env.DBPORT || 27017;

// For development
process.env.URI = `mongodb://${process.env.DBHOST}:${process.env.DBPORT}/${process.env.DBNAME}`;

// For production
// process.env.URI = `mongodb://${process.env.DBUSER}:${process.env.DBPASS}@${process.env.DBHOST}:${process.env.DBPORT}/${process.env.DBNAME}`;