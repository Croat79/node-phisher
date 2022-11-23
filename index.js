const nm = require("nodemailer");
const fs = require("node:fs");
const prompt = require("prompt");

var HOST = "0.0.0.0";
var PORT = 8080;

var sender = '"Fred Foo 👻" <foo@example.com>'; // Objet de votre faux email

var smtp = "smtp.ethereal.email"; // Domaine du Serveur SMTP
var smtp_port = 587; // Port du Serveur SMTP

var user = ""; // Utilisateur du Serveur SMTP
var password = ""; // Mot de passe de l'utilisateur

var secure = false; // Serveur SMTP Sécurisé ?

var fake_title = "Votre faux titre"; // Objet de votre faux email
var time = 1; // Durée de l'expérience (en heures)

prompt.get(
  [
    "express_host",
    "express_port",
    "smtp_host",
    "smtp_port",
    "username",
    "password",
    "secure",
    "fake_title",
    "time",
  ],

  async (err, res) => {
    if (err) throw err;
    console.log(res);

    HOST = res["express_host"];
    PORT = res["express_port"];

    smtp = res["smtp_host"];
    smtp_port = parseInt(res["smtp_port"]);

    user = res["username"];
    password = res["password"];

    secure = res["secure"] == "yes" ? true : false;

    fake_title = res["fake_title"];
    time = parseInt(res["time"]);

    await main();
  }
);

async function main() {
  let transporter = nm.createTransport({
    host: smtp,
    port: smtp_port,
    secure: secure,
    auth: {
      user: user,
      pass: password,
    },
  });

  fs.readFile("./emails.txt", "utf-8", async (err, data) => {
    if (err) throw err;

    var emails = data.split(",");

    for (let i = 0; i < emails.length; i++) {
      const item = emails[i];

      var message = {
        from: sender,
        to: item,
        subject: fake_title,
        text: fs.readFileSync("./assets/body.txt", "utf-8"),
        html: fs.readFileSync("./assets/body.html", "utf-8"),
      };

      await transporter
        .sendMail(message)
        .then(() => {
          console.info(`Mail sended to ${item}`);
        })
        .catch((err) => {
          console.error(new Error(err));
        });
    }

    console.log("Opening express...");

    var app = require("express")();

    var macro = 0;
    var link = 0;

    app.get("/opened/:type", (req, res) => {
      if (req.params.type == "macro") {
        macro++;
      }

      if (req.params.type == "link") {
        link++;
      }

      res.redirect(req.query.redirect);
    });

    app.listen(PORT, HOST, () => {
      console.info(`Opened! Closing in ${time} hours...`);
    });

    setTimeout(async () => {
      for (let i = 0; i < emails.length; i++) {
        const item = emails[i];

        var message = {
          from: sender,
          to: item,
          subject: "Vous avez participé à une expérience de sécurité.",
          text: fs
            .readFileSync("./assets/final.txt", "utf-8")
            .replace("{LINK}", link)
            .replace("{MACRO}", macro),
          html: fs
            .readFileSync("./assets/final.html", "utf-8")
            .replace("{LINK}", link)
            .replace("{MACRO}", macro),
        };

        await transporter
          .sendMail(message)
          .then(() => {
            console.info(`Final mail sended to ${item}`);
          })
          .catch((err) => {
            console.error(new Error(err));
          });
      }
    }, 1000 * 60 * 60 * time);
  });
}
