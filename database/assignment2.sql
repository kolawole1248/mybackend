SELECT * FROM public.account;

INSERT INTO public.account (account_firstname,account_lastname,account_email,account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');


UPDATE public.account
SET account_type = 'Admin'
WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';

DELETE FROM public.account
WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';

SELECT * FROM public.inventory;
UPDATE public.inventory
SET inv_description = REPLACE(inv_description,'small interiors','huge interiors')

WHERE inv_make = 'GM' AND inv_model = 'Hummer'


SELECT inv_model, classification_name
FROM public.inventory 
INNER JOIN public.classification 
ON inv_model = classification_name
WHERE classification_name = 'Sport';



SELECT * FROM public.inventory;
UPDATE public.inventory
SET 
    inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');