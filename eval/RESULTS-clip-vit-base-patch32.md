# Evaluation: Xenova/clip-vit-base-patch32 (q8), zero-shot, 132 sky photos + 24 non-sky photos from Wikimedia Commons

Run: 2026-10-06T22:23:28.746Z - Node v24.19.0, CPU, 192 ms/image

Chance level with 13 classes: 7.7%. Accuracy rows below are over the 132 sky photos.

| Metric | Value |
|---|---|
| Top-1 accuracy (shipped rule: best prompt per class) | 53/132 = 40.2% |
| Top-1 accuracy (alternative: mean over prompts) | 60/132 = 45.5% |
| Top-3 accuracy | 90/132 = 68.2% |
| Answers flagged "confident" | 31/132 |
| Accuracy when confident | 26/31 = 83.9% |
| Sky photos wrongly rejected as "not the sky" | 0/132 |
| Non-sky photos (lawns, living rooms) correctly rejected | 24/24 |
| Thunderstorm photos that get the storm warning (top guess or warning line) | 5/12 |
| Other sky photos that also get the storm warning (false alarms) | 16/120 |

## Per class (top-1)

| Class | Correct | Most common predictions |
|---|---|---|
| cirrus | 3/12 | cirrocumulus x5, cirrus x3, stratus x2, altocumulus x1, contrail x1 |
| cirrocumulus | 7/12 | cirrocumulus x7, cirrus x1, cumulus x1, contrail x1, nimbostratus x1, altostratus x1 |
| cirrostratus | 2/12 | altocumulus x4, cirrostratus x2, stratocumulus x2, cirrocumulus x2, stratus x1, altostratus x1 |
| altocumulus | 6/12 | altocumulus x6, cirrocumulus x5, altostratus x1 |
| altostratus | 9/12 | altostratus x9, cirrostratus x1, contrail x1, stratus x1 |
| nimbostratus | 3/12 | altostratus x4, nimbostratus x3, stratus x2, contrail x1, cirrus x1, altocumulus x1 |
| stratocumulus | 0/12 | cumulus x6, altostratus x2, cirrocumulus x2, contrail x1, stratus x1 |
| stratus | 1/12 | altostratus x5, stratocumulus x4, stratus x1, altocumulus x1, cirrocumulus x1 |
| cumulus | 6/12 | cumulus x6, cumulonimbus x2, altocumulus x1, contrail x1, stratus x1, cirrus x1 |
| cumulonimbus | 4/12 | cumulus x4, cumulonimbus x4, clear x1, nimbostratus x1, contrail x1, cirrus x1 |
| contrail | 12/12 | contrail x12 |
| notsky | 24/24 | notsky x24 |

## Every image

| Label (Commons category) | Prediction | Correct | File |
|---|---|---|---|
| cirrus | altocumulus (26%) | no | File:2019-09-10 19 33 26 Cirrus clouds near sunset viewed from Apple Barrel Court in the Franklin Farm section of Oak Hill, Fairfax County, Virginia.jpg |
| cirrus | contrail (19%) | no | File:2019-09-10 19 35 47 Cirrus clouds near sunset viewed from Franklin Farm Park in the Franklin Farm section of Oak Hill, Fairfax County, Virginia.jpg |
| cirrus | cirrus (17%) | yes | File:2019-09-10 19 36 46 Cirrus clouds near sunset viewed from Franklin Farm Park in the Franklin Farm section of Oak Hill, Fairfax County, Virginia.jpg |
| cirrus | cirrocumulus (16%) | no | File:2019-09-10 19 39 58 Cirrus clouds near sunset viewed from White Barn Lane in the Franklin Farm section of Oak Hill, Fairfax County, Virginia.jpg |
| cirrus | cirrocumulus (16%) | no | File:2019-09-11 19 34 01 Cirrus clouds near sunset viewed from Franklin Farm Park in the Franklin Farm section of Oak Hill, Fairfax County, Virginia.jpg |
| cirrus | stratus (16%) | top-3 | File:2019-09-27 06 47 53 Cirrus clouds near sunrise viewed from a walking path in the Franklin Glen section of Chantilly, Fairfax County, Virginia.jpg |
| cirrus | cirrocumulus (15%) | top-3 | File:2019-11-13 17 10 09 Sky and cirrus just after sunset along Ben Nevis Court in the Chantilly Highlands section of Oak Hill, Fairfax County, Virginia.jpg |
| cirrus | cirrocumulus (12%) | top-3 | File:2019-11-13 17 10 12 Sky and cirrus just after sunset along Ben Nevis Court in the Chantilly Highlands section of Oak Hill, Fairfax County, Virginia.jpg |
| cirrus | cirrus (13%) | yes | File:2019-11-13 17 10 25 Sky and cirrus just after sunset along Ben Nevis Court in the Chantilly Highlands section of Oak Hill, Fairfax County, Virginia.jpg |
| cirrus | cirrus (18%) | yes | File:2019-11-13 17 10 34 Sky and cirrus just after sunset along Ben Nevis Court in the Chantilly Highlands section of Oak Hill, Fairfax County, Virginia.jpg |
| cirrus | cirrocumulus (15%) | top-3 | File:2019-11-13 17 10 57 Sky and cirrus just after sunset along Ben Nevis Court in the Chantilly Highlands section of Oak Hill, Fairfax County, Virginia.jpg |
| cirrus | stratus (14%) | top-3 | File:2019-11-13 17 11 00 Sky and cirrus just after sunset along Ben Nevis Court in the Chantilly Highlands section of Oak Hill, Fairfax County, Virginia.jpg |
| cirrocumulus | cirrus (22%) | top-3 | File:2021-11-27 15 52 16 Cirrocumulus "Mackeral sky" above the Franklin Farm section of Oak Hill, Fairfax County, Virginia.jpg |
| cirrocumulus | cumulus (30%) | top-3 | File:2021-11-27 15 54 11 Cirrocumulus "Mackeral sky" above the Franklin Farm section of Oak Hill, Fairfax County, Virginia.jpg |
| cirrocumulus | cirrocumulus (16%) | yes | File:2022-06-03 20 33 07 Cirrocumulus at sunset viewed from Aquetong Lane in the Mountainview section of Ewing Township, Mercer County, New Jersey.jpg |
| cirrocumulus | contrail (30%) | top-3 | File:2022-12-29 16 58 03 Cirrocumulus clouds shortly after sunset along Mercer County Route 636 (Parkside Avenue) in Ewing Township, Mercer County, New Jersey.jpg |
| cirrocumulus | nimbostratus (18%) | no | File:2023-10-13 18 30 01 Cirrocumulus (mackeral sky) near sunset viewed from the National Weather Service's Philadelphia-Mount Holly Weather Forecast Office in Westampton Township, Burlington County, New Jersey.jpg |
| cirrocumulus | cirrocumulus (28%) | yes | File:2023-10-13 18 30 17 Cirrocumulus (mackeral sky) near sunset viewed from the National Weather Service's Philadelphia-Mount Holly Weather Forecast Office in Westampton Township, Burlington County, New Jersey.jpg |
| cirrocumulus | cirrocumulus (19%) | yes | File:2023-10-13 18 30 35 Cirrocumulus (mackeral sky) near sunset viewed from the National Weather Service's Philadelphia-Mount Holly Weather Forecast Office in Westampton Township, Burlington County, New Jersey.jpg |
| cirrocumulus | cirrocumulus (27%) | yes | File:2023-10-13 18 30 48 Cirrocumulus (mackeral sky) near sunset viewed from the National Weather Service's Philadelphia-Mount Holly Weather Forecast Office in Westampton Township, Burlington County, New Jersey.jpg |
| cirrocumulus | cirrocumulus (22%) | yes | File:2023-10-13 18 30 51 Cirrocumulus (mackeral sky) near sunset viewed from the National Weather Service's Philadelphia-Mount Holly Weather Forecast Office in Westampton Township, Burlington County, New Jersey.jpg |
| cirrocumulus | cirrocumulus (24%) | yes | File:2023-10-13 18 31 18 Cirrocumulus (mackeral sky) near sunset viewed from the National Weather Service's Philadelphia-Mount Holly Weather Forecast Office in Westampton Township, Burlington County, New Jersey.jpg |
| cirrocumulus | altostratus (14%) | no | File:2023-10-13 18 31 49 Cirrocumulus (mackeral sky) near sunset viewed from the National Weather Service's Philadelphia-Mount Holly Weather Forecast Office in Westampton Township, Burlington County, New Jersey.jpg |
| cirrocumulus | cirrocumulus (27%) | yes | File:2025-07-29 10 23 44 Cirrocumulus clouds viewed from Aquetong Lane in the Mountainview section of Ewing Township, Mercer County, New Jersey.jpg |
| cirrostratus | cirrostratus (56%) | yes | File:(139) Cirrostratus.jpg |
| cirrostratus | stratus (21%) | no | File:2014-12-09 15 06 39 High cirrostratus clouds moving into Elko, Nevada.JPG |
| cirrostratus | cirrostratus (68%) | yes | File:2019-11-07 14 17 51 Cirrostratus clouds obscuring the sun along Old Ox Road in the Dulles section of Sterling, Loudoun County, Virginia.jpg |
| cirrostratus | altostratus (63%) | top-3 | File:2020-02-20 09 12 22 Sun dimly visible through cirrostratus along Old Ox Road in the Dulles section of Sterling, Loudoun County, Virginia.jpg |
| cirrostratus | stratocumulus (18%) | no | File:2020-11-03 16 46 48 Cirrostratus clouds just after sunset along New Jersey State Route 70 on the border of Brielle and Wall Township in Monmouth County, New Jersey.jpg |
| cirrostratus | altocumulus (22%) | no | File:2020-11-03 16 49 02 Cirrostratus clouds just after sunset at the junction of New Jersey State Route 34, New Jersey State Route 35 and New Jersey State Route 70 in Wall Township, Monmouth County, New Jersey.jpg |
| cirrostratus | altocumulus (41%) | no | File:2020-11-03 16 49 08 Cirrostratus clouds just after sunset at the junction of New Jersey State Route 34, New Jersey State Route 35 and New Jersey State Route 70 in Wall Township, Monmouth County, New Jersey.jpg |
| cirrostratus | cirrocumulus (23%) | no | File:2020-11-03 16 54 18 Cirrostratus clouds just after sunset at the junction of New Jersey State Route 34 and Monmouth County Route 524 in Wall Township, Monmouth County, New Jersey.jpg |
| cirrostratus | stratocumulus (20%) | no | File:2020-11-03 16 54 22 Cirrostratus clouds just after sunset at the junction of New Jersey State Route 34 and Monmouth County Route 524 in Wall Township, Monmouth County, New Jersey.jpg |
| cirrostratus | cirrocumulus (18%) | no | File:2020-11-03 16 55 22 Cirrostratus clouds just after sunset at the junction of New Jersey State Route 34 and Monmouth County Route 524 in Wall Township, Monmouth County, New Jersey.jpg |
| cirrostratus | altocumulus (33%) | top-3 | File:2020-11-03 16 56 35 Cirrostratus clouds just after sunset at the junction of New Jersey State Route 34 and Monmouth County Route 524 in Wall Township, Monmouth County, New Jersey.jpg |
| cirrostratus | altocumulus (22%) | no | File:2020-11-03 16 58 28 Cirrostratus clouds just after sunset at the junction of New Jersey State Route 34 and Monmouth County Route 524 in Wall Township, Monmouth County, New Jersey.jpg |
| altocumulus | cirrocumulus (51%) | top-3 | File:2025-07-29 08 15 46 "Mackerel sky" Altocumulus clouds viewed from Aquetong Lane in the Mountainview section of Ewing Township, Mercer County, New Jersey.jpg |
| altocumulus | altocumulus (34%) | yes | File:2025-08-29 06 21 57 Altocumulus clouds just before sunrise viewed from Burlington County Route 630 (Woodlane Road) in Westampton Township, Burlington County, New Jersey.jpg |
| altocumulus | cirrocumulus (25%) | top-3 | File:2025-08-29 06 22 01 Altocumulus clouds just before sunrise viewed from Burlington County Route 630 (Woodlane Road) in Westampton Township, Burlington County, New Jersey.jpg |
| altocumulus | altocumulus (23%) | yes | File:2025-08-29 06 25 08 Altocumulus clouds just before sunrise viewed from Burlington County Route 630 (Woodlane Road) in Westampton Township, Burlington County, New Jersey.jpg |
| altocumulus | cirrocumulus (27%) | top-3 | File:2025-08-29 06 25 11 Altocumulus clouds just before sunrise viewed from Burlington County Route 630 (Woodlane Road) in Westampton Township, Burlington County, New Jersey.jpg |
| altocumulus | altocumulus (32%) | yes | File:2025-08-29 06 25 14 Altocumulus clouds just before sunrise viewed from Burlington County Route 630 (Woodlane Road) in Westampton Township, Burlington County, New Jersey.jpg |
| altocumulus | altocumulus (28%) | yes | File:2025-11-14 21 18 08 Altocumulus clouds at night viewed from Aquetong Lane in the Mountainview section of Ewing Township, Mercer County, New Jersey.jpg |
| altocumulus | altocumulus (23%) | yes | File:2025-11-15 06 36 20 Altocumulus clouds just before sunrise viewed from Interstate 295 in Bordentown Township, Burlington County, New Jersey.jpg |
| altocumulus | altocumulus (36%) | yes | File:2025-11-15 06 42 08 Altocumulus clouds just before sunrise viewed from Interstate 295 in Bordentown Township, Burlington County, New Jersey.jpg |
| altocumulus | altostratus (23%) | top-3 | File:2026-05-26 19 02 02 Altocumulus clouds viewed from Mountain View Road in the Mountainview section of Ewing Township, Mercer County, New Jersey.jpg |
| altocumulus | cirrocumulus (36%) | no | File:2026-05-26 19 06 43 Altocumulus clouds viewed from Mountain View Road in the Mountainview section of Ewing Township, Mercer County, New Jersey.jpg |
| altocumulus | cirrocumulus (38%) | top-3 | File:2026-05-27 19 44 51 Altocumulus clouds viewed from Mountain View Road in the Mountainview section of Ewing Township, Mercer County, New Jersey.jpg |
| altostratus | altostratus (62%) | yes | File:2017-06-22 16 57 51 Sun shining dimly through an altostratus cloud layer over Ladybank Lane in the Chantilly Highlands section of Oak Hill, Fairfax County, Virginia.jpg |
| altostratus | altostratus (80%) | yes | File:2019-02-10 15 20 16 The sun fading behind altostratus along Centreville Road (Virginia State Route 657) in Chantilly, Fairfax County, Virginia.jpg |
| altostratus | altostratus (62%) | yes | File:2019-02-10 15 23 48 The sun fading behind altostratus along Centreville Road (Virginia State Route 657) in Chantilly, Fairfax County, Virginia.jpg |
| altostratus | altostratus (62%) | yes | File:2019-02-10 15 29 53 The sun fading behind altostratus along Centreville Road (Virginia State Route 657) in Chantilly, Fairfax County, Virginia.jpg |
| altostratus | altostratus (60%) | yes | File:2019-02-10 15 32 49 The sun fading behind altostratus along Centreville Road (Virginia State Route 657) in Chantilly, Fairfax County, Virginia.jpg |
| altostratus | altostratus (24%) | yes | File:2019-02-21 17 34 01 Fallstreaks from altostratus in the Dulles section of Sterling, Loudoun County, Virginia.jpg |
| altostratus | cirrostratus (16%) | top-3 | File:2020-03-06 06 51 49 The sun rising underneath an altostratus cloud deck along Old Ox Road in the Dulles section of Sterling, Loudoun County, Virginia.jpg |
| altostratus | contrail (26%) | top-3 | File:2020-03-06 07 07 44 The sun rising underneath an altostratus cloud deck along Old Ox Road in the Dulles section of Sterling, Loudoun County, Virginia.jpg |
| altostratus | altostratus (51%) | yes | File:2020-10-16 17 05 13 Altostratus clouds above Elderberry Place in the Franklin Glen section of Chantilly, Fairfax County, Virginia.jpg |
| altostratus | altostratus (45%) | yes | File:2020-10-16 17 05 21 Altostratus clouds above Elderberry Place in the Franklin Glen section of Chantilly, Fairfax County, Virginia.jpg |
| altostratus | altostratus (24%) | yes | File:2020-10-16 17 18 19 Altostratus clouds above Hidden Meadow Drive in the Franklin Glen section of Chantilly, Fairfax County, Virginia.jpg |
| altostratus | stratus (30%) | no | File:2020-10-16 17 18 50 Altostratus clouds above Hidden Meadow Drive in the Franklin Glen section of Chantilly, Fairfax County, Virginia.jpg |
| nimbostratus | contrail (27%) | no | File:Decayingnimbostratus1.jpg |
| nimbostratus | altostratus (34%) | top-3 | File:Earlymorningnimbostratus1.jpg |
| nimbostratus | altostratus (37%) | top-3 | File:Nimbostratus 01.jpg |
| nimbostratus | stratus (21%) | no | File:Nimbostratus and air current.jpg |
| nimbostratus | altostratus (30%) | top-3 | File:Nimbostratus and Nimbostratus pannus 1.jpg |
| nimbostratus | nimbostratus (61%) | yes | File:Nimbostratus before thunderstorm.jpg |
| nimbostratus | cirrus (33%) | top-3 | File:Nimbostratus clouds on Auckland's Southwestern Motorway.jpg |
| nimbostratus | altostratus (38%) | no | File:Nimbostratus Clouds Virginia USA.JPG |
| nimbostratus | altocumulus (43%) | top-3 | File:Nimbostratus clouds. The Geographer.jpg |
| nimbostratus | stratus (47%) | no | File:Nimbostratus clouds.jpg |
| nimbostratus | nimbostratus (44%) | yes | File:Nimbostratus Forest.jpg |
| nimbostratus | nimbostratus (47%) | yes | File:Nimbostratus in Istanbul.jpg |
| stratocumulus | cumulus (17%) | top-3 | File:ISS-34 Stratocumulus clouds.jpg |
| stratocumulus | cumulus (17%) | no | File:ISS034E016601 - Stratocumulus Clouds - Pacific Ocean.jpg |
| stratocumulus | contrail (18%) | no | File:S65-63264 Network of stratocumulus clouds SW of the Canary Islands on Earth.jpg |
| stratocumulus | cumulus (44%) | top-3 | File:Stratocumulusfromabove.jpg |
| stratocumulus | altostratus (28%) | no | File:Abendliche Stratocumulus-Stimmung II.jpg |
| stratocumulus | altostratus (23%) | top-3 | File:Abendliche Stratocumulus-Stimmung.jpg |
| stratocumulus | stratus (72%) | top-3 | File:Die Wasserkuppe in tiefem Stratocumulus castellanus.jpg |
| stratocumulus | cumulus (17%) | top-3 | File:Early stages of Stratocumulus castellanus (18122021).jpg |
| stratocumulus | cumulus (15%) | no | File:Abendrot an Stratocumulus floccus II.jpg |
| stratocumulus | cirrocumulus (16%) | no | File:Abendrot an Stratocumulus floccus III.jpg |
| stratocumulus | cirrocumulus (22%) | no | File:Abendrot an Stratocumulus floccus IV.jpg |
| stratocumulus | cumulus (19%) | no | File:Abendrot an Stratocumulus floccus.jpg |
| stratus | stratocumulus (25%) | top-3 | File:2018-04-15 07 05 23 Panoramic view of approaching stratus clouds associated with a backdoor cold front at the National Weather Service Forecast Office Baltimore-Washington in the Dulles section of Sterling, Loudoun County, Virginia.jpg |
| stratus | altostratus (25%) | top-3 | File:2018-04-15 07 05 47 Approaching stratus clouds associated with a backdoor cold front along Weather Service Road in the Dulles section of Sterling, Loudoun County, Virginia.jpg |
| stratus | altostratus (27%) | top-3 | File:2019-03-09 06 47 05 Sun peaking out beneath a low stratus deck just after sunrise in the Dulles section of Sterling, Loudoun County, Virginia.jpg |
| stratus | stratocumulus (24%) | top-3 | File:2019-10-13 13 58 40 Stratus over a field along Old Ox Road in the Dulles section of Sterling, Loudoun County, Virginia.jpg |
| stratus | stratus (25%) | yes | File:2019-10-13 13 58 43 Stratus over a field along Old Ox Road in the Dulles section of Sterling, Loudoun County, Virginia.jpg |
| stratus | altocumulus (18%) | no | File:2019-10-13 13 58 47 Stratus over a field along Old Ox Road in the Dulles section of Sterling, Loudoun County, Virginia.jpg |
| stratus | stratocumulus (29%) | no | File:2019-10-13 13 58 49 Stratus over a field along Old Ox Road in the Dulles section of Sterling, Loudoun County, Virginia.jpg |
| stratus | altostratus (31%) | top-3 | File:2019-11-30 12 58 05 Stratus clouds over a field along Old Ox Road in the Dulles section of Sterling, Loudoun County, Virginia.jpg |
| stratus | stratocumulus (19%) | no | File:2019-11-30 12 58 13 Stratus clouds over a field along Old Ox Road in the Dulles section of Sterling, Loudoun County, Virginia.jpg |
| stratus | altostratus (37%) | no | File:2019-11-30 12 58 52 Stratus clouds over a field along Old Ox Road in the Dulles section of Sterling, Loudoun County, Virginia.jpg |
| stratus | altostratus (23%) | top-3 | File:2020-05-18 09 13 58 Stratus clouds with bases that are about 700 feet above ground level over the KLWX WSR-88D NEXRAD in the Dulles section of Sterling, Loudoun County, Virginia.jpg |
| stratus | cirrocumulus (21%) | no | File:2020-11-12 15 48 05 Base of low stratus clouds viewed from Kirkwell Place in the Chantilly Highlands section of Oak Hill, Fairfax County, Virginia.jpg |
| cumulus | cumulus (35%) | yes | File:2026-08-21 19 40 51 Cumulus clouds near sunset viewed from Aquetong Lane in the Mountainview section of Ewing Township, Mercer County, New Jersey.jpg |
| cumulus | cumulus (22%) | yes | File:2026-08-21 19 40 54 Cumulus clouds near sunset viewed from Aquetong Lane in the Mountainview section of Ewing Township, Mercer County, New Jersey.jpg |
| cumulus | cumulus (40%) | yes | File:2026-08-21 19 40 57 Cumulus clouds near sunset viewed from Aquetong Lane in the Mountainview section of Ewing Township, Mercer County, New Jersey.jpg |
| cumulus | altocumulus (29%) | top-3 | File:2026-08-21 19 43 58 Cumulus clouds near sunset viewed from Aquetong Lane in the Mountainview section of Ewing Township, Mercer County, New Jersey.jpg |
| cumulus | cumulonimbus (36%) | top-3 | File:2016 Chmura Cumulus congestus 01.jpg |
| cumulus | cumulus (21%) | yes | File:2016 Chmura Cumulus congestus 02.jpg |
| cumulus | cumulonimbus (95%) | top-3 | File:2019-05-25 09-51-19 cumulus.jpg |
| cumulus | cumulus (49%) | yes | File:2019-05-25 09-51-53 cumulus.jpg |
| cumulus | cumulus (56%) | yes | File:2020-08-09 20 05 10 Cumulus clouds near sunset viewed from Tayloe Court in the Franklin Farm section of Oak Hill, Fairfax County, Virginia.jpg |
| cumulus | contrail (19%) | no | File:2021-09-10 19 34 10 High altitude wildfire smoke and cumulus clouds just after sunset in the Dulles section of Sterling, Loudoun County, Virginia.jpg |
| cumulus | stratus (12%) | no | File:2021-09-10 19 34 13 High altitude wildfire smoke and cumulus clouds just after sunset in the Dulles section of Sterling, Loudoun County, Virginia.jpg |
| cumulus | cirrus (16%) | no | File:2021-09-10 19 34 16 High altitude wildfire smoke and cumulus clouds just after sunset in the Dulles section of Sterling, Loudoun County, Virginia.jpg |
| cumulonimbus | cumulus (23%) | top-3 | File:Cumulonimbus cloud over Italy.jpg |
| cumulonimbus | cumulonimbus (27%) | yes | File:2015-04-23 14 04 58 Developing cumulonimbus clouds over the Ruby Mountains and Pinon Range viewed from Bullion Road (Elko County Route 720) about 5.5 miles north of Bullion, Nevada.jpg |
| cumulonimbus | cumulonimbus (92%) | yes | File:2016-07-19 16 04 37 View north toward a developing thunderstorm cumulonimbus cloud from U.S. Route 340 near Shenandoah River Road just north of Shenandoah in Page County, Virginia.jpg |
| cumulonimbus | cumulonimbus (85%) | yes | File:2016-07-19 16 05 55 View north along U.S. Route 340 toward a developing thunderstorm cumulonimbus cloud from near Shenandoah River Road just north of Shenandoah in Page County, Virginia.jpg |
| cumulonimbus | cumulus (15%) | no | File:Altocumulonimbus-Corfidi.jpg |
| cumulonimbus | clear (20%) | no | File:2013-06-07 15-53-58-cumulonimbus.jpg |
| cumulonimbus | cumulus (20%) | no | File:2015-04-23 13 45 38 A developing cumulonimbus cloud over the Ruby Mountains of Elko County, Nevada viewed from Bullion Road (Elko County Route 720) about 2.9 miles north of Bullion, Nevada.jpg |
| cumulonimbus | cumulus (18%) | no | File:2015-04-23 13 52 14 A developing cumulonimbus cloud over the Ruby Mountains of Elko County, Nevada viewed from Bullion Road (Elko County Route 720) about 3.6 miles north of Bullion, Nevada.jpg |
| cumulonimbus | nimbostratus (17%) | no | File:2015-04-23 13 55 19 A developing cumulonimbus cloud over the Ruby Mountains of Elko County, Nevada viewed from Bullion Road (Elko County Route 720) about 4.2 miles north of Bullion, Nevada.jpg |
| cumulonimbus | contrail (28%) | no | File:Altocumulonimbus-front-chaud.jpg |
| cumulonimbus | cirrus (21%) | no | File:Cumulonimbus Virga 001.jpg |
| cumulonimbus | cumulonimbus (64%) | yes | File:Distant Cumulonimbus Cloud.jpg |
| contrail | contrail (87%) | yes | File:Airplane contrail over Quebec City.jpg |
| contrail | contrail (19%) | yes | File:Contrail 1921.jpg |
| contrail | contrail (67%) | yes | File:Contrail chromosomes, close-up (7588816558).jpg |
| contrail | contrail (56%) | yes | File:Contrail just about to separate into "chromosome" shapes (7588806612).jpg |
| contrail | contrail (97%) | yes | File:Contrails (Condensation Trail).jpg |
| contrail | contrail (69%) | yes | File:Contrails 3May 2025 (1).jpg |
| contrail | contrail (85%) | yes | File:Contrails 3May 2025 (10).jpg |
| contrail | contrail (81%) | yes | File:Contrails 3May 2025 (11).jpg |
| contrail | contrail (85%) | yes | File:Contrails 3May 2025 (12).jpg |
| contrail | contrail (85%) | yes | File:Contrails 3May 2025 (13).jpg |
| contrail | contrail (89%) | yes | File:Contrails 3May 2025 (14).jpg |
| contrail | contrail (83%) | yes | File:Contrails 3May 2025 (15).jpg |
| notsky | notsky (31%) | yes | File:-DirtyLens- . . . . . -dirtylens -grass -clouds -n (45674599265).jpg |
| notsky | notsky (80%) | yes | File:... loosing prime (2898366019).jpg |
| notsky | notsky (33%) | yes | File:066 Digging a hole with a shovel - gardening tools.jpg |
| notsky | notsky (99%) | yes | File:084 Green grass lawn background, green mowed grass free photo.jpg |
| notsky | notsky (97%) | yes | File:121234 kibbutz bari - planting grass PikiWiki Israel.jpg |
| notsky | notsky (98%) | yes | File:121235 kibbutz bari - planting grass PikiWiki Israel.jpg |
| notsky | notsky (93%) | yes | File:121236 kibbutz bari - planting grass PikiWiki Israel.jpg |
| notsky | notsky (81%) | yes | File:121237 kibbutz bari - planting grass PikiWiki Israel.jpg |
| notsky | notsky (91%) | yes | File:121238 kibbutz bari - planting grass PikiWiki Israel.jpg |
| notsky | notsky (77%) | yes | File:121239 kibbutz bari - planting grass PikiWiki Israel.jpg |
| notsky | notsky (96%) | yes | File:121240 kibbutz bari - planting grass PikiWiki Israel.jpg |
| notsky | notsky (61%) | yes | File:15. Moses Grinter House and Ferry (1420 South 78th St, Kansas City, KS) on the Santa Fe National Historic Trail (2004) (0f717e29-2322-4be8-b3e6-602c3c00a7c2).jpg |
| notsky | notsky (70%) | yes | File:(Portrait de famille dans un salon) - Fonds Trutat - 51Fi309.jpg |
| notsky | notsky (74%) | yes | File:(Portrait de famille dans un salon) - Fonds Trutat - 51Fi310.jpg |
| notsky | notsky (89%) | yes | File:1- TANG TRET (2).jpg |
| notsky | notsky (98%) | yes | File:Sir George Grey at Mansion House, photograph by D L Mundy.jpg |
| notsky | notsky (98%) | yes | File:19th century Victorian living room, Auckland - 0816.jpg |
| notsky | notsky (97%) | yes | File:19th century Victorian living room, Auckland - 0825.jpg |
| notsky | notsky (54%) | yes | File:19th century Victorian living room, Auckland - 0843.jpg |
| notsky | notsky (98%) | yes | File:19th century Victorian living room, Auckland - 0846.jpg |
| notsky | notsky (94%) | yes | File:2019 12 24 Karácsony DSC 0092 (49268571453).jpg |
| notsky | notsky (86%) | yes | File:5הבית שלנו בירושלים.jpg |
| notsky | notsky (46%) | yes | File:7.5 Wohnzimmer. Poliert.jpg |
| notsky | notsky (69%) | yes | File:A Kenya (11).jpg |

Caveat: Commons category labels are crowd-sourced, not expert-verified, and many photos contain several genera.