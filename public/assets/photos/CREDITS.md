# Photography credits

All photography on this website is sourced from Wikimedia Commons under the licences listed below.
These are **demonstration / placeholder photographs** and are not photographs of HydroTech installations.
Replace them with HydroTech's own project and product photography before launch.

## How to swap in real photographs

1. Put the full-size originals in `assets/photos/` (not `public/` — the masters are never published).
2. Point the matching `withPhoto()` name in `src/data/images.js` at the new file.
3. Remove the `demo: true` flag for that entry so the "demo imagery" notice stops appearing in the UI.
4. Drop the "Demo image" tags and the notices in `src/data/site.js` once nothing is left to label.
5. Run `npm run check` — it rebuilds the image variants and fails the build if any
   source photo, published variant or generated manifest entry has gone missing.

`npm run images` (run automatically by `npm run dev` and `npm run build`) resizes each
master into 480/800/1200/1800px variants, writes a ~20px blurred placeholder for the
loading background, and regenerates `src/data/images.generated.js`.

## Credits

The headings below name the source master. Every `gen/<name>-<width>.jpg` file in the
published set is a resized, re-encoded derivative of the matching master.

### assets/photos/hero-drip.jpg
- Source: https://commons.wikimedia.org/wiki/File:Driprication.jpg
- Author: Poojasasikumar
- Licence: CC BY-SA 4.0
- Subject: Save the water

### assets/photos/hero-sprinkler.jpg
- Source: https://commons.wikimedia.org/wiki/File:Sprinklers_Garlic_Fields_Mallikorai_Nilgiris_Apr26_A7CR_10661.jpg
- Author: This Photo was taken by Timothy A. Gonsalves. Feel free to use my photos, but please mention me as the author. I would much appreciate if you send me an email tagooty@yahoo.com or write on my talk page, for my information. Please contact me before commercial use. Please do not upload an edited image here without consulting me. I would like to make corrections only at my own source to ensure that the changes improve the image and are preserved.Otherwise you may upload an edited image with a new name. Please use one of the templates derivative or extract.
- Licence: CC BY-SA 4.0
- Subject: Sprinklers watering freshly planted garlic fields, Mallikorai, Udhagai taluk, Nilgiris, Tamil Nadu, India

### assets/photos/hero-automation.jpg
- Source: https://commons.wikimedia.org/wiki/File:Polyhouse_cultivation%2Cvillage_Dhaar%2Cdistrict_Solan%2C_Himachal_Pradesh.jpg
- Author: Harvinder Chandigarh
- Licence: CC BY-SA 4.0
- Subject: Polyhouse cultivation,village Dhaar,district Solan, Himachal Pradesh

### assets/photos/intro-land.jpg
- Source: https://commons.wikimedia.org/wiki/File:Farmer_working_in_the_field_with_their_tractor.jpg
- Author: Gillsaab1998
- Licence: CC0
- Subject: Farmer working in the field with their tractor

### assets/photos/sol-drip.jpg
- Source: https://commons.wikimedia.org/wiki/File:Drip_irrigation.jpg
- Author: United States Department of Agriculture
- Licence: Public domain
- Subject: Drip irrigation uses a series of pipes and tubes to deliver water to the base of each plant. Because little water is lost to evaporation and runoff, this method

### assets/photos/sol-sprinkler.jpg
- Source: https://commons.wikimedia.org/wiki/File:NRBC_distributary_10_sprinkler_irrigation_fields_Raichur_Karnataka_India.jpg
- Author: Vraj Acharya, WELL Labs
- Licence: CC BY-SA 4.0
- Subject: Sprinkler irrigation in agricultural fields supplied by Distributary 10 of the Narayanpur Right Bank Canal (NRBC) in Raichur district, Karnataka, India. The ima

### assets/photos/sol-automation.jpg
- Source: https://commons.wikimedia.org/wiki/File:Floriculture_in_village_Mahog_%2CChail%2C_Himachal_Pradesh%2CIndia_03.jpg
- Author: Harvinder Chandigarh
- Licence: CC BY-SA 4.0
- Subject: Floriculture in village Mahog ,Chail, Himachal Pradesh,India

### assets/photos/svc-nursery.jpg
- Source: https://commons.wikimedia.org/wiki/File:Flowers_Nursery_in_Pune.jpg
- Author: Katharva
- Licence: CC BY-SA 3.0
- Subject: Flowers Nursery in Pune

### assets/photos/svc-plantation.jpg
- Source: https://commons.wikimedia.org/wiki/File:Coconut_Trees_Trivandrum.jpg
- Author: arunpnair
- Licence: CC BY-SA 2.0
- Subject: Coconut palms at Neyyatinkara near Trivandrum in Kerala

### assets/photos/svc-landscape.jpg
- Source: https://commons.wikimedia.org/wiki/File:A_Beautiful_Garden.jpg
- Author: Saikat Patra
- Licence: CC BY-SA 3.0
- Subject: This is a photo of ASI monument number

### assets/photos/svc-landscape2.jpg
- Source: https://commons.wikimedia.org/wiki/File:Rambagh_Palace_view_from_garden%2C_July_2016.jpg
- Author: Sunnya343
- Licence: CC BY-SA 4.0
- Subject: Rambagh Palace viewed from the garden. Jaipur, India

### assets/photos/svc-equipment.jpg
- Source: https://commons.wikimedia.org/wiki/File:Borewell_pump_and_irrigation_pipes_in_a_Raichur%2C_India_agricultural_fields_growing_cotton.jpg
- Author: User: Vraj Acharya, WELL Labs
- Licence: CC BY-SA 4.0
- Subject: A modern agricultural scene showing the mechanics of groundwater extraction. A borewell pump head is seen in the foreground, with flexible black piping running 

### assets/photos/svc-water.jpg
- Source: https://commons.wikimedia.org/wiki/File:Ground_water_tubewell_irrigation_crop_Gujarat_India.jpg
- Author: TeshTesh
- Licence: CC BY-SA 4.0
- Subject: crop irrigation with ground water, powered by electricity Gujarat India 2015

### assets/photos/prod-drip-emitter.jpg
- Source: https://commons.wikimedia.org/wiki/File:Drip_emitter.jpg
- Author: Alan.ca
- Licence: Public domain
- Subject: Drip emitter on a rockwool and expand clay hydroponic setup.

### assets/photos/prod-drip-line.jpg
- Source: https://commons.wikimedia.org/wiki/File:Drip_Irrigation_T-tape.jpg
- Author: David Trainer
- Licence: CC BY-SA 2.0
- Subject: (from author) "The principle behind drip irrigation is to deliver water directly to the base of the plant, as opposed to indiscriminately watering the ground ar

### assets/photos/prod-sprinkler.jpg
- Source: https://commons.wikimedia.org/wiki/File:Irrigation_Sprinkler.jpg
- Author: Wikideas1
- Licence: CC0
- Subject: Irrigation Sprinkler in farm field

### assets/photos/prod-sprinkler-lawn.jpg
- Source: https://commons.wikimedia.org/wiki/File:A_Sprinkler_(43839556670).jpg
- Author: Sister Perish
- Licence: CC0
- Subject: I forced the camera to remove its hot mirror in normal mode (instead of in night shot mode) with a strong neodymium magnet.

### assets/photos/prod-control.jpg
- Source: https://commons.wikimedia.org/wiki/File:Peanuts_irrigation_in_india.jpg
- Author: Seratobikiba
- Licence: CC BY-SA 4.0
- Subject: peanuts ditch irrigation

### assets/photos/prod-filter.jpg
- Source: https://commons.wikimedia.org/wiki/File:Langsamsandfilterbecken-1.jpg
- Author: Dat doris
- Licence: CC BY-SA 4.0
- Subject: Wassergewinnung nach dem 2. Mülheimer Verfahren mit Langsamsandfilterbecken. Anschließend wird das Wasser mit Ozon und UV-Licht behandelt und erreicht Trinkwass

### assets/photos/prod-pipes.jpg
- Source: https://commons.wikimedia.org/wiki/File:Borewell_pump_and_irrigation_pipes_in_a_Raichur%2C_India_agricultural_fields_growing_cotton.jpg
- Author: User: Vraj Acharya, WELL Labs
- Licence: CC BY-SA 4.0
- Subject: A modern agricultural scene showing the mechanics of groundwater extraction. A borewell pump head is seen in the foreground, with flexible black piping running 

### assets/photos/prod-accessory.jpg
- Source: https://commons.wikimedia.org/wiki/File:Irrigation_dripper.jpg
- Author: fir0002 flagstaffotos [at] gmail.com Canon 20D + Tamron 28-75mm f/2.8
- Licence: GFDL 1.2
- Subject: Irrigation dripper

### assets/photos/app-field.jpg
- Source: https://commons.wikimedia.org/wiki/File:Cuddalore_district_paddy_fields.jpg
- Author: Flickr user Melanie Molitor
- Licence: CC BY 2.0
- Subject: Paddy fields between Pondicherry and Chidambaram (Cuddalore district, Tamil Nadu, India).

### assets/photos/app-vegetable.jpg
- Source: https://commons.wikimedia.org/wiki/File:Creeper_vegetable_farming_at_Tallavalasa.jpg
- Author: Adityamadhav83
- Licence: CC BY-SA 4.0
- Subject: Creeper vegetable farming at Tallavalasa, Visakhapatnam

### assets/photos/app-fruit.jpg
- Source: https://commons.wikimedia.org/wiki/File:Mango_Orchard_in_Poovankurichi.jpg
- Author: Rahuljeswin
- Licence: CC BY-SA 4.0
- Subject: Mango Orchard in Poovankurichi

### assets/photos/app-fruit2.jpg
- Source: https://commons.wikimedia.org/wiki/File:Bananal_-_panoramio.jpg
- Author: beatopografia
- Licence: CC BY-SA 3.0
- Subject: bananal

### assets/photos/app-plantation.jpg
- Source: https://commons.wikimedia.org/wiki/File:Coconut_tree_orchard.JPG
- Author: Nikhilb239
- Licence: CC BY-SA 3.0
- Subject: Coconut tree orchard near Kayamkulam

### assets/photos/app-nursery.jpg
- Source: https://commons.wikimedia.org/wiki/File:RJDRP_Nursery_DSC0282.jpg
- Author: T. R. Shankar Raman
- Licence: CC BY-SA 4.0
- Subject: Native plants nursery of Rao Jodha Desert Rock Park, Jodphpur, Rajasthan, India, showing seedlings raised in polybags under shade netting.

### assets/photos/app-greenhouse.jpg
- Source: https://commons.wikimedia.org/wiki/File:Polyhouse.jpg
- Author: Al Jo Zeb
- Licence: CC BY-SA 4.0
- Subject: picture of polyhouse

### assets/photos/app-garden.jpg
- Source: https://commons.wikimedia.org/wiki/File:Lawn%2C_BBK_DAV_College_for_Women%2C_Amritsar%2C_Punjab%2C_India_(2006).jpg
- Author: Principal of the College
- Licence: CC BY-SA 3.0
- Subject: A View of one of the lawns

### assets/photos/app-landscape.jpg
- Source: https://commons.wikimedia.org/wiki/File:Beautiful_Poovankurichi_%2CTirunelveli_6.jpg
- Author: Rahuljeswin
- Licence: CC BY-SA 4.0
- Subject: Beautiful vegetable garden in Poovankurichi ,Tirunelveli

### assets/photos/proj-field-pipes.jpg
- Source: https://commons.wikimedia.org/wiki/File:Ploughed_Fields_Irrigation_Kulisholai_Nilgiris_Jun26_OM5_0104.jpg
- Author: This Photo was taken by Timothy A. Gonsalves. Feel free to use my photos, but please mention me as the author. I would much appreciate if you send me an email tagooty@yahoo.com or write on my talk page, for my information. Please contact me before commercial use. Please do not upload an edited image here without consulting me. I would like to make corrections only at my own source to ensure that the changes improve the image and are preserved.Otherwise you may upload an edited image with a new name. Please use one of the templates derivative or extract.
- Licence: CC BY-SA 4.0
- Subject: Freshly ploughed fields with water pipes and sprinklers, ready for planting vegetables, near Kulisholai, The Nilgiris, Tamil Nadu, India

### assets/photos/proj-vineyard.jpg
- Source: https://commons.wikimedia.org/wiki/File:Wineyard_at_Cumbum.JPG
- Author: Sibyperiyar
- Licence: CC BY-SA 3.0
- Subject: Wineyard at Cumbum, TN

### assets/photos/proj-seedlings.jpg
- Source: https://commons.wikimedia.org/wiki/File:Crop_seedling_beds_irrigated_in_Kerala_India_2008.jpg
- Author: Ajay Tallam from Milpitas, USA
- Licence: CC BY-SA 2.0
- Subject: Pre-plantation

### assets/photos/proj-tubewell.jpg
- Source: https://commons.wikimedia.org/wiki/File:Ground_water_tubewell_irrigation_horticulture_Gujarat_India.jpg
- Author: TeshTesh
- Licence: CC BY-SA 4.0
- Subject: crop irrigation with ground water, powered by electricity Gujarat India 2015

### assets/photos/proj-spraying.jpg
- Source: https://commons.wikimedia.org/wiki/File:Field_irrigation_spraying.JPG
- Author: Nick Birse
- Licence: CC BY-SA 4.0
- Subject: Impact sprinkler based field irrigation system in a carrot field in east Scotland. The sprinkler arcs over around 145 degrees with a geared or spring loaded mec

### assets/photos/proj-peanut.jpg
- Source: https://commons.wikimedia.org/wiki/File:Peanuts_irrigation_in_india.jpg
- Author: Seratobikiba
- Licence: CC BY-SA 4.0
- Subject: peanuts ditch irrigation

### assets/photos/proj-network.jpg
- Source: https://commons.wikimedia.org/wiki/File:Narayanpur_Right_Bank_Canal_distributary_10_aerial_irrigation_network_Karnataka_India.jpg
- Author: Vraj Acharya, WELL Labs
- Licence: CC BY-SA 4.0
- Subject: An aerial (drone) view of the Narayanpur Right Bank Canal (NRBC) in Karnataka, India, showing Distributary 10 branching off from the main canal. The larger line

### assets/photos/about-main.jpg
- Source: https://commons.wikimedia.org/wiki/File:Farming_field.jpg
- Author: Devmani Tripathi
- Licence: CC BY 4.0
- Subject: Farming session in my village

### assets/photos/about-cauvery.jpg
- Source: https://commons.wikimedia.org/wiki/File:Cauvery_fosters_greenery_in_Mettur.jpg
- Author: Vijay S
- Licence: CC BY 2.0

### assets/photos/about-fields.jpg
- Source: https://commons.wikimedia.org/wiki/File:Landscape_near_Auroville%2C_Pondicherry.jpg
- Author: Satdeep Gill
- Licence: CC BY-SA 4.0
- Subject: Landscape near Auroville, Pondicherry, India.

### assets/photos/about-family.jpg
- Source: https://commons.wikimedia.org/wiki/File:Family_farming.jpg
- Author: Ojaswini Kapu
- Licence: CC BY-SA 4.0
- Subject: In the fields, family finds smiles pausing from life's hustle to nurture their roots,it reflects a peaceful day spent together and immerse themselves in the ser

### assets/photos/about-karur.jpg
- Source: https://commons.wikimedia.org/wiki/File:Delonix_elata-1-karur-tn-India.jpg
- Author: Yercaud-elango
- Licence: CC BY-SA 4.0
- Subject: Caesalpiniaceae-padenarayan;tree,flowers yellow.

### assets/photos/contact-field.jpg
- Source: https://commons.wikimedia.org/wiki/File:Lushgreen_and_Blue_Sky.jpg
- Author: Av1428
- Licence: CC BY-SA 4.0
- Subject: Lushgreen and Blue Sky, Ooty

### assets/photos/contact-karur.jpg
- Source: https://commons.wikimedia.org/wiki/File:Pichavaram_Mangrove_Forest.jpg
- Author: Satdeep Gill
- Licence: CC BY-SA 4.0
- Subject: Pichavaram Mangrove Forest
