var oracledb = require('oracledb');
var dbConfig = require('./dbconfig');
//oracledb.autoCommit = true;

var methods = {

  getConnection : async function() {
    let connection;
    try{
      connection = await oracledb.getConnection(  {
        user          : dbConfig.user,
        password      : dbConfig.password,
        connectString : dbConfig.connectString
      });
      return connection
    }catch (err) {
      console.error(err);
    }
    return connection;
  },
  closeConnection : async function(connection) {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  },

  runQuery:async function(connection,sql,binds) {
  
    try {

      let options, result;
      
      binds = {};

      // For a complete list of options see the documentation.
      options = {
        outFormat: oracledb.OBJECT   // query result format
        
        // extendedMetaData: true,   // get extra metadata
        // fetchArraySize: 100       // internal buffer allocation size for tuning
      };

      result = await connection.execute(sql, binds, options);

      console.log("Column metadata: ", result.metaData);
      console.log("Query results: ");
      console.log(result.rows);
      //onResult(result.rows);
      return result;
      
    } catch (err) {
      console.error(err);
    } finally {
      
    }
  },
  runQuerySE:async function(sql,onResult) {
    let connection;
  
    try {
  
      let binds, options, result;
  
      connection = await oracledb.getConnection(  {
        user          : dbConfig.seuser,
        password      : dbConfig.sepassword,
        connectString : dbConfig.seconnectString
      });
  
      // Create a table
  
      
  
      // Query the data
  
      //sql = `SELECT distinct automation_host from AUTOMATION_RUN_HEAD`;
      //sql = `SELECT distinct FUNCTIONALITY, MANUAL_TC_NAME  from AUTOMATION_RUN_SCRIPT_RESULT order by FUNCTIONALITY`;
  
      binds = {};
  
      // For a complete list of options see the documentation.
      options = {
        outFormat: oracledb.OBJECT   // query result format
        
        // extendedMetaData: true,   // get extra metadata
        // fetchArraySize: 100       // internal buffer allocation size for tuning
      };
  
      result = await connection.execute(sql, binds, options);
  
      console.log("Column metadata: ", result.metaData);
      console.log("Query results: ");
      //console.log(result.rows);
      onResult(result.rows);
      
    } catch (err) {
      console.error(err);
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error(err);
        }
      }
    }
    },

  runInsert:async function(sql,binds,onResult) {
    let connection;
  
    try {
  
      let options, result;
  
      connection = await oracledb.getConnection(  {
        user          : dbConfig.user,
        password      : dbConfig.password,
        connectString : dbConfig.connectString
      });
  
      // Create a table
  
      
  
      // Query the data
  
      //sql = `SELECT distinct automation_host from AUTOMATION_RUN_HEAD`;
      //sql = `SELECT distinct FUNCTIONALITY, MANUAL_TC_NAME  from AUTOMATION_RUN_SCRIPT_RESULT order by FUNCTIONALITY`;
  
      // For a complete list of options see the documentation.
      //var rid = { type: oracledb.STRING, dir: oracledb.BIND_OUT };
      //binds.rid=rid ; 
      options = {
        // query result format
        autoCommit:true
        // extendedMetaData: true,   // get extra metadata
        // fetchArraySize: 100       // internal buffer allocation size for tuning
      };
      
      result = await connection.execute(sql, binds, options);
      console.log(result.outBinds);
      //console.log("Column metadata: ", result.metaData);
      console.log("Query results: "+result);
      //console.log(result.rows);
      onResult(result);
      
    } catch (err) {
      console.error(err);
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error(err);
        }
      }
    }
    }
};
module.exports = methods;
//run();