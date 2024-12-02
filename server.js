const express = require("express");
const pool = require("./db");
const crypto = require("crypto"); // Para gerar IDs únicos
const port = 3000;

const app = express();
app.use(express.json());

// Rota para criar um ingresso (ticket)
app.post("/ticket", async (req, res) => {
  const { name, birthdate, cpf } = req.body;
  
  if (!name || !birthdate || !cpf) {
    return res.status(400).send({
      message: "Name, birthdate, and cpf are required"
    });
  }

  const ticketId = crypto.randomBytes(16).toString("hex"); // Gera um ID único para o ticket
  
  try {
    // Insere o usuário na tabela "users"
    const userQuery = "INSERT INTO users (name, birthdate, cpf) VALUES ($1, $2, $3) RETURNING id";
    const userResult = await pool.query(userQuery, [name, birthdate, cpf]);
    const userId = userResult.rows[0].id;

    // Cria o ticket associado ao usuário
    const ticketQuery = "INSERT INTO tickets (ticket_id, user_id) VALUES ($1, $2)";
    await pool.query(ticketQuery, [ticketId, userId]);

    res.status(200).send({
      message: "Ticket created",
      ticketId: ticketId
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({
      message: "Error creating ticket"
    });
  }
});


//3b3f37cf5566fdb90fa3a5d40e552d33

// Rota para buscar um ingresso via ticket_id
app.get("/ticket/:ticketId", async (req, res) => {
  const { ticketId } = req.params;

  try {
    // Busca o ticket pelo ID
    const ticketQuery = "SELECT t.ticket_id, u.name, u.birthdate, u.cpf FROM tickets t JOIN users u ON t.user_id = u.id WHERE t.ticket_id = $1";
    const result = await pool.query(ticketQuery, [ticketId]);

    if (result.rows.length === 0) {
      return res.status(404).send({
        message: "Ticket not found"
      });
    }

    const ticketData = result.rows[0];
    res.status(200).send({
      ticketId: ticketData.ticket_id,
      name: ticketData.name,
      birthdate: ticketData.birthdate,
      cpf: ticketData.cpf
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({
      message: "Error fetching ticket"
    });
  }
});

// Rota para criar a tabela de tickets e associar ao usuário
app.get("/setup", async (req, res) => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50),
        birthdate DATE,
        cpf VARCHAR(11)
      );

      CREATE TABLE IF NOT EXISTS tickets (
        ticket_id VARCHAR(32) PRIMARY KEY,
        user_id INT REFERENCES users(id)
      );
    `);

    res.status(200).send({
      message: "Tables created successfully"
    });
  } catch (error) {
    console.error(error.message);
    res.sendStatus(500);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
