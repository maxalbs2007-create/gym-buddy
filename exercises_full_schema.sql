-- Ajoute les colonnes sous_groupe et description à la table exercises
alter table exercises add column if not exists sous_groupe text;
alter table exercises add column if not exists description text;

-- Exemple d'insertion enrichie (à compléter pour chaque exercice)
insert into exercises (name, muscle_group, sous_groupe, equipment, description) values
('Squat', 'Jambes', 'Quadriceps', 'Barre', 'Exercice polyarticulaire de base pour les jambes, sollicite principalement les quadriceps, fessiers et ischios.'),
('Soulevé de terre jambes tendues', 'Jambes', 'Ischios', 'Barre', 'Cible les ischios-jambiers et les fessiers, mouvement d’extension de hanche.'),
('Développé couché', 'Pectoraux', 'Pectoraux', 'Barre', 'Mouvement de poussée horizontal, développe la masse et la force des pectoraux.'),
('Tractions pronation', 'Dos', 'Grand dorsal', 'Poids du corps', 'Exercice de tirage vertical pour le dos, accent sur la largeur.'),
('Développé militaire', 'Épaules', 'Faisceau antérieur', 'Barre', 'Développe la force et la masse des épaules, surtout l’avant.'),
('Curl haltères', 'Biceps', 'Brachial', 'Haltères', 'Isolation du biceps, permet un travail unilatéral.'),
('Barre front', 'Triceps', 'Longue portion', 'Barre', 'Extension des triceps, accent sur la longue portion.'),
('Crunch', 'Abdos', 'Grand droit', 'Poids du corps', 'Cible le grand droit de l’abdomen, mouvement de flexion du tronc.'),
('Course à pied', 'Cardio', 'Endurance', 'Tapis', 'Travail cardiovasculaire, améliore l’endurance générale.');
-- ... (compléter avec tous les exercices du seed précédent, en précisant sous_groupe et description)
