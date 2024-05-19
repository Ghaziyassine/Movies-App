# <img alt="TMDB Logo" width="500px" src="src/assets/tmdb-long-logo.png" />

This is a personal project created for a college assignment.<br>
This was created using TypeScript, ReactNative, Expo.<br>
Thanks to <a href="https://www.themoviedb.org">The Movie Database</a> for providing an awesome API that made this project possible 🤠<br>

## Preview


https://github.com/Ghaziyassine/Movies-App/assets/114885285/9bf221ed-b228-4365-b4a7-9cd284b0a999



## Running the project

Clone the repo: <br>
`git clone git@github.com:arthurbz/tmdb-app.git`

Then cd into it:<br>
`cd tmdb-app`

Create a .env file with your TMDB API Key:<br>
`echo API_KEY={API_KEY} >> .env`

Install dependencies:<br>
`npm i`

Run 🤠<br>
`npm start`

Simple as that, then all you need to do is open Expo Go and scan the QR Code!<br>
Or, if you prefer, run on a virtual device inside your computer.
----------------------------------------------------------------------------------------------------------------------------------------------------------------
# VHDL : realisation d'un encodeur de priorité et l'integration d'une ALU (additionneur)

## explications: 

le code VHDL implémente un encodeur de priorité avec une unité arithmétique logique (UAL) intégrée. L'encodeur prend un vecteur d'entrée de 4 bits (I) et produit une sortie de 2 bits (A). De plus, il effectue une opération d'addition arithmétique sur le vecteur d'entrée et fournit le résultat via la sortie ALU_out.

## Ports
I (Entrée) : Un vecteur d'entrée de 4 bits.
A (Sortie) : Une sortie de 2 bits représentant la valeur encodée en fonction de la priorité des bits d'entrée.
ALU_out (Sortie) : Une sortie de 4 bits représentant le résultat de l'opération d'addition arithmétique effectuée par l'UAL.
Signal Interne
ALU_result : Un signal de 4 bits utilisé pour stocker le résultat de l'opération de l'UAL.

## Processus
Le bloc principal de processus évalue le vecteur d'entrée (I) et attribue des valeurs à la sortie (A) et au résultat de l'UAL (ALU_result) en fonction de la priorité des bits d'entrée.

## Logique d'Encodage de Priorité
L'instruction case à l'intérieur du processus évalue le vecteur d'entrée I et attribue les valeurs suivantes aux sorties :

Lorsque I est "0000" :
A est défini à "00".
ALU_result est défini à "0000" (aucune opération de l'UAL).
Lorsque I est l'une des valeurs suivantes : "1000", "1111", "1001", "1011", "1010", "1101", "1100", "1110" :
A est défini à "11".
ALU_result est la somme de "1000" et I.
Lorsque I est l'une des valeurs suivantes : "0100", "0101", "0110", "0111" :
A est défini à "10".
ALU_result est la somme de "0100" et I.
Lorsque I est "0010" ou "0011" :
A est défini à "01".
ALU_result est la somme de "0010" et I.
Pour toutes les autres valeurs de I :
A est défini à "00" (valeurs inattendues).
ALU_result est défini à "0000" (aucune opération de l'UAL).


##screens :

![image](https://github.com/Ghaziyassine/Movies-App/assets/147449053/09cf1e63-0dac-43fb-8771-b09573693041)


![image](https://github.com/Ghaziyassine/Movies-App/assets/147449053/7506b073-3cb7-48b1-8516-33a11e890ff9)

## collaborators 
ghita-baghdad
