-- Ajout des colonnes pour enrichissement
alter table exercises add column if not exists sub_group text;
alter table exercises add column if not exists description text;

-- Exemples d'insertion enrichie
insert into exercises (name, muscle_group, sub_group, equipment, description) values
-- JAMBES : Quadriceps
('Squat', 'Jambes', 'Quadriceps', 'Barre', 'Exercice polyarticulaire de base pour le bas du corps, sollicite principalement les quadriceps, fessiers et ischios. Technique et gainage essentiels.'),
('Squat avant', 'Jambes', 'Quadriceps', 'Barre', 'Variante du squat mettant l’accent sur les quadriceps et le gainage du tronc.'),
('Leg extension', 'Jambes', 'Quadriceps', 'Machine', 'Exercice d’isolation pour cibler les quadriceps, idéal en finition ou rééducation.'),
-- JAMBES : Ischios
('Soulevé de terre jambes tendues', 'Jambes', 'Ischios', 'Barre', 'Cible les ischios et les fessiers, attention à la technique pour protéger le dos.'),
('Leg curl allongé', 'Jambes', 'Ischios', 'Machine', 'Isolation des ischios, mouvement de flexion du genou.'),
-- JAMBES : Fessiers
('Hip thrust', 'Jambes', 'Fessiers', 'Barre', 'Exercice roi pour le développement des fessiers, amplitude complète recommandée.'),
-- DOS : Largeur
('Tractions pronation', 'Dos', 'Largeur', 'Poids du corps', 'Développe la largeur du dos, prise large pour cibler le grand dorsal.'),
('Tirage vertical', 'Dos', 'Largeur', 'Machine', 'Alternative guidée aux tractions, pour cibler le grand dorsal.'),
-- DOS : Épaisseur
('Rowing barre', 'Dos', 'Épaisseur', 'Barre', 'Développe l’épaisseur du dos, sollicite aussi les lombaires et les biceps.'),
('Rowing haltère', 'Dos', 'Épaisseur', 'Haltères', 'Permet un travail unilatéral, amplitude complète recommandée.'),
-- PECTORAUX : Haut
('Développé incliné barre', 'Pectoraux', 'Haut', 'Barre', 'Accent sur la partie supérieure des pectoraux, important pour un torse complet.'),
-- PECTORAUX : Bas
('Développé décliné', 'Pectoraux', 'Bas', 'Barre', 'Cible la partie inférieure des pectoraux.'),
-- BICEPS : Chef court
('Curl pupitre', 'Biceps', 'Chef court', 'Barre', 'Isolation du biceps, limite la triche.'),
-- BICEPS : Chef long
('Curl incliné', 'Biceps', 'Chef long', 'Haltères', 'Met l’accent sur l’étirement du biceps.'),
-- TRICEPS : Long chef
('Barre front', 'Triceps', 'Long chef', 'Barre', 'Cible le long chef du triceps, amplitude complète recommandée.'),
-- ABDOS : Grand droit
('Crunch', 'Abdos', 'Grand droit', 'Poids du corps', 'Exercice de base pour les abdominaux, attention à ne pas tirer sur la nuque.'),
-- CARDIO : HIIT
('Burpees', 'Cardio', 'HIIT', 'Poids du corps', 'Exercice complet, sollicite tout le corps et le cardio, idéal pour les circuits.');
