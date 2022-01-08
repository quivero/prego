'use strict';

const client = require('./db.js').client;

async function query_builder(request_str, params_list, log_str){
  console.log('Teste!');
  var result = await client.query(request_str, params_list)
                          .catch(e => console.error(e.stack));
  console.log('Sucesso!');
  console.log(result);
};

module.exports = {
        				  query_builder: (req_str, params_list, log_str) => 
                                query_builder(req_str, params_list, log_str),
				         };
