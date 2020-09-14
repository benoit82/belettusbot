# belettusbot :

https://discord.com/api/oauth2/authorize?client_id=748585400083152966&permissions=1010896&scope=bot

Bot créé pour aider la communauté auquel j'appartiens sur Discord.

Pour ce projet, j'utilise l'API de DiscordJS (v12.3.1), une base de donnée MongoDB (hébergement sur Mongo Atlas) et développe sur le runtime NodeJS (v12.16.1)

Exemple d'évènement :
https://i.imgur.com/LwUPBwh.png

# Commandes disponibles

- help : liste les commandes disponibles par le bot et fourni les informations pour chacune d'elle afin de guider les utilisateurs dans son utilisation.
- addevent : créer un nouvel évènement. Les utilisateurs peuvent s'inscrire en réagissant au post de l'évènement et le BOT met à jour automatiquement les inscrits selon la réaction, comme on peux le voir sur l'exemple.
- cancelevent : annule un évènement. Si des utilisateurs se sont inscrit, le bot leur envoye un message privé pour les prévenir de l'annulation.
- clearevents : purge la base de donnée des évènements fermé (dépassé dans le temps)
- imgevent : modifie/ajoute l'illustration pour l'affichage de l'évènement
- myevents : affiche une liste des évènements actifs que l'utilisateur a créer
- nextevents : affiche une liste des évènements à venir sur X jours (paramètrable) avec le lien d'inscription. Par défaut, la liste affiche les évènements prévu sous 7 jours.

Commandes d'administrateur (réservé aux membres au role le plus élèvé):

- config : pour configurer les réactions aux évènements, changer le préfix d'appel au bot, paramètrer les salons de log et d'évènement.

# Futurs idées de développement

- affichage de l'ordre des inscriptions (priorisation si trop d'inscrit)
- commande :
  - eventupdate (date/URLimage) pour modifier une date/heure d'un évènement et prévenir les inscrits des changements. Cette commande annulera la commande imgevent devenu obsolète.
  - eventtemplate (create/update/delete/list) : création de template d'évènement pour raccourcir et rendre plus simple la création d'évènement.

* loin dans le futur :

- interaction avec mon site https://ffxivrosterhelper.web.app/ pour ajouter des logs de roster

# version actuel : 1.1.0

## nouveautés :

- Ajout de la commande eventtemplate (list/create/update/delete)
- ordre d'inscription affiché sur la carte d'évènement
