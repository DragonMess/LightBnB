-- INSERT INTO users (name, email, password)
-- VALUES ('Camilo Pineda', 'km@gmail.com', '12345'),
-- ('Eva Stanley', 'eva@gmail.com', '12345'),
-- ('Dominic Parks', 'dom@gmail.com', '12345');

-- INSERT INTO properties (id,owner_id, title, thumbnail_photo_url,cover_photo_url,cost_per_night,
-- parking_spaces,number_of_bathrooms,number_of_bedrooms,country,street,city,province,post_code)
-- VALUES (1,'Townhouse','/dossier','/folder/file',250,1,2,3,'canada','rue xx','qc','h3p-xxx'),
-- (2,'Townhouse','/dossier','/folder/file',250,1,2,3,'canada','rue xx','qc','h3p-xxx'),
-- (3,'Townhouse','/dossier','/folder/file',250,1,2,3,'canada','rue xx','qc','h3p-xxx');

-- INSERT INTO reservations (guest_id, property_id, start_date, end_date) 
-- VALUES (1, 1, '2018-09-11', '2018-09-26'),
-- (2, 2, '2019-01-04', '2019-02-01'),
-- (3, 3, '2021-10-01', '2021-10-14');

-- INSERT INTO property_reviews (guest_id, property_id,reservation_id,rating,message) 
-- VALUES (1, 1,1,10,'good for price'),
-- (2, 2,2,10,'good for price'),
-- (3, 3,3,10,'good for price');
