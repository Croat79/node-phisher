# Node Phisher

NodeJS Phishing Tester

## Comment ça marche ?

Le programme va lire tous les mails que contiennent le fichier `emails.txt` et va leur envoyer un mail contenant une page HTML (personnalisable).

Puis, un serveur express va s'ouvrir pendant un temps définit.

Après ce temps, le serveur va se fermer et envoyer un dernier mail à toutes les personnes concernées.

Ce dernier mail sera une page de prévention, mettant en valeur combien de personnes ont cliqué sur les liens, et activé des macros.

## Comment savoir si les personnes ont activé les macros ?

Les macros d'Office fonctionnent avec le language de programation nommé "VBA".

Une fois la macro activée, elle va envoyer une requête HTTP au serveur.

Les macros sont à intégrer vous-même dans les fichiers.

Pour des raisons de sécurité, je ne donnerai que le script pour faire des requêtes.

```vb
' Import HTTP module
Sub http()

Dim MyRequest As Object ' Create the Request Class

    Set MyRequest = CreateObject("WinHttp.WinHttpRequest.5.1") ' Set it to a variable

    MyRequest.Open "GET", _ ' Open the HTTP Request
    "http://something/opened/macro" ' Here's the server address

    MyRequest.Send ' Send Request

    MsgBox MyRequest.ResponseText ' Displays a message to user

End Sub
```

## Comment utiliser le programme ?

Juste, lancez `start.cmd`, entrez une durée de fonctionnement (en heures).
