# Python script to generate simplified, accurate Brazil 27 States SVG path vectors
# Coordinates mapped on standard Brazil Mercator projection in 600x600 coordinate box

import json

# Simplified path coordinates for all 27 Brazilian states (UF)
brazil_paths = {
    "AC": "M 48 245 L 82 238 L 105 260 L 98 285 L 55 288 L 35 265 Z", # Acre
    "AM": "M 75 125 L 140 100 L 210 110 L 225 155 L 250 170 L 235 240 L 160 270 L 105 260 L 82 238 L 75 160 Z", # Amazonas
    "RR": "M 140 60 L 180 50 L 195 85 L 175 125 L 140 100 Z", # Roraima
    "AP": "M 285 65 L 315 75 L 310 120 L 275 110 L 285 65 Z", # Amapá
    "PA": "M 210 110 L 275 110 L 310 120 L 345 140 L 355 200 L 330 250 L 290 260 L 250 240 L 250 170 L 225 155 Z", # Pará
    "RO": "M 130 270 L 160 270 L 185 265 L 205 305 L 175 335 L 145 320 L 130 270 Z", # Rondônia
    "TO": "M 315 220 L 350 220 L 355 285 L 330 335 L 305 325 L 310 260 Z", # Tocantins
    "MA": "M 345 140 L 385 145 L 400 185 L 380 235 L 350 220 L 355 200 Z", # Maranhão
    "PI": "M 385 145 L 420 165 L 415 230 L 385 265 L 380 235 L 400 185 Z", # Piauí
    "CE": "M 420 165 L 460 160 L 465 195 L 435 210 L 415 190 Z", # Ceará
    "RN": "M 460 160 L 490 165 L 485 190 L 465 185 Z", # Rio Grande do Norte
    "PB": "M 465 185 L 490 190 L 485 210 L 445 210 Z", # Paraíba
    "PE": "M 435 210 L 485 210 L 480 230 L 420 230 Z", # Pernambuco
    "AL": "M 465 230 L 480 230 L 475 250 L 455 245 Z", # Alagoas
    "SE": "M 450 245 L 465 245 L 460 260 L 445 255 Z", # Sergipe
    "BA": "M 385 265 L 420 230 L 455 245 L 465 270 L 460 335 L 420 365 L 375 340 L 365 295 Z", # Bahia
    "MT": "M 205 305 L 290 260 L 310 260 L 305 325 L 295 385 L 255 400 L 225 380 L 205 305 Z", # Mato Grosso
    "GO": "M 305 325 L 355 335 L 360 410 L 325 430 L 295 385 Z", # Goiás
    "DF": "M 338 360 L 348 360 L 348 370 L 338 370 Z", # Distrito Federal
    "MS": "M 245 400 L 295 385 L 310 440 L 280 475 L 245 460 L 235 425 Z", # Mato Grosso do Sul
    "MG": "M 355 335 L 420 365 L 430 420 L 390 460 L 350 445 L 340 415 L 360 380 Z", # Minas Gerais
    "ES": "M 430 405 L 450 410 L 445 440 L 425 435 Z", # Espírito Santo
    "RJ": "M 395 455 L 435 440 L 425 465 L 385 470 Z", # Rio de Janeiro
    "SP": "M 300 445 L 350 445 L 385 470 L 365 505 L 315 500 L 290 475 Z", # São Paulo
    "PR": "M 285 480 L 345 490 L 340 535 L 285 530 L 275 505 Z", # Paraná
    "SC": "M 285 530 L 340 535 L 345 560 L 290 560 Z", # Santa Catarina
    "RS": "M 275 545 L 335 550 L 330 600 L 270 595 L 250 560 Z" # Rio Grande do Sul
}

# State centroid positions for tooltips and labels
centroids = {
    "AC": {"x": 70, "y": 265},
    "AM": {"x": 160, "y": 185},
    "RR": {"x": 165, "y": 85},
    "AP": {"x": 295, "y": 90},
    "PA": {"x": 280, "y": 185},
    "RO": {"x": 165, "y": 300},
    "TO": {"x": 330, "y": 275},
    "MA": {"x": 370, "y": 185},
    "PI": {"x": 400, "y": 205},
    "CE": {"x": 440, "y": 185},
    "RN": {"x": 475, "y": 175},
    "PB": {"x": 470, "y": 200},
    "PE": {"x": 455, "y": 220},
    "AL": {"x": 470, "y": 240},
    "SE": {"x": 455, "y": 252},
    "BA": {"x": 415, "y": 305},
    "MT": {"x": 255, "y": 335},
    "GO": {"x": 330, "y": 375},
    "DF": {"x": 343, "y": 365},
    "MS": {"x": 270, "y": 435},
    "MG": {"x": 385, "y": 405},
    "ES": {"x": 438, "y": 422},
    "RJ": {"x": 410, "y": 455},
    "SP": {"x": 340, "y": 475},
    "PR": {"x": 310, "y": 510},
    "SC": {"x": 315, "y": 545},
    "RS": {"x": 295, "y": 575}
}

out_data = {
    "paths": brazil_paths,
    "centroids": centroids
}

with open(r"C:\Users\HYPE AMD\Documents\FILE\PROJECT\PORTOFOLIO\01. Vercel\project\content\data\brazil_map.json", "w") as f:
    json.dump(out_data, f, indent=2)

print("Brazil map JSON created successfully.")
