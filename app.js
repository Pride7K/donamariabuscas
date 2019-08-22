
const express = require('express');
const bodyParser = require('body-parser');
const Sequelize = require("sequelize");
const http = require("http");
const debug = require("debug")("TCC:app");
const app = express();

const banco = new Sequelize("tccteste","root","123",
{
  host:"localhost",
  dialect:"mysql"
});

banco.authenticate().then(function(){console.log("Conexao com banco OK")}).catch(function(a){console.log("Aparentemente ocorreu um erro no banco: " + a)});


app.use(bodyParser.json());
app.use(express.static('./public'));


const AssistantV2 = require('ibm-watson/assistant/v1');

const port = NormalizarPorta(process.env.PORT || "3000");

const server = http.createServer(app);
const router =express.Router();

const assistant = new AssistantV2({
  version: '2018-09-20',
  iam_apikey: 'XSm7MgmAE18iXX4gHf7MiKhGxel4ldBxtNkPiDP3d-dZ',
  url: "https://gateway-syd.watsonplatform.net/assistant/api"
});


app.post("/add",function(req,resp)
{
  resp.send("nice");
})

app.post('/conversation/', (req, res) => {
  const { text, context = {} } = req.body;

  const params = {
    input: { text },
    workspace_id:'f865dd60-880e-4cbd-abd7-72644ae74001',
    context,
  };

  assistant.message(params, (err, response) => {
    if (err) {
      console.error(err);
      res.status(500).json(err);
    } else {
      res.json(response);
    }
  });
});



const route = router.get("/", function (req,resp,next)
{
  resp.status(200).send
  ({
    title:"Node Store API",
    version:"0.0.1"
  });
});

const create = router.post("/",function(req,resp,next)
{
 resp.status(201).send(req.body);
});
const put = router.put("/testando/:id",function(req,resp,next)
{
  const id = req.params.id;
  resp.status(201).send({
    id:id,
    item:req.body
  });
});
const delet = router.delete("/",function(req,resp,next)
{
 resp.status(200).send(req.body);
});

app.use("/" , route)
app.use("/products" , create)
app.use("/testando/",put);
app.use("/products",delet);

server.listen(port, () => console.log(`Rodando na porta ${port}`));
server.on("error",TratandoErro);
server.on("listening",onListening);

function NormalizarPorta(val)
{
  const port = parseInt(val,10)

  if(isNaN(port))
  {
    return val;
  }
  if(port>=0)
  {
    return port;
  }
  return false;
}

function TratandoErro(error)
{
  if(erpr.syscall !== "listen")
  {
    throw error;
  }
  const bind = typeof port ==="string" ?
  "Pipe " + port :
  "Port " + port;

  switch (error.code)
  {
    case "EACCES":
      console.error(bind + " necessita de mais privilégios");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " porta ja esta em uso");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening()
{
  const addr = server.address();
  const bind = typeof addr === "string"
  ? "pipe" + addr
  : "port" + addr.port;
  debug("Listening on " + bind)
}
