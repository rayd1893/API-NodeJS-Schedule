DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users 
(
	user_id INT PRIMARY KEY,
	full_name VARCHAR(200) NOT NULL,
	created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
	updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
	created_by INT NOT NULL,
	updated_by INT NOT NULL,
	deleted BOOLEAN NOT NULL
);

DROP TABLE IF EXISTS clients CASCADE;
CREATE TABLE clients
(
	client_id SERIAL PRIMARY KEY,
	email VARCHAR(50) NOT NULL,
	legal_name VARCHAR(50),
	contact_name VARCHAR(50),
	created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
	updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
	created_by INT NOT NULL,
	updated_by INT NOT NULL,
	deleted BOOLEAN
);

DROP TABLE IF EXISTS schedules CASCADE;
CREATE TABLE schedules
(
	schedule_id SERIAL PRIMARY KEY,
	description VARCHAR(50) NOT NULL,
	event_start DATE  NOT NULL,
	event_end DATE,
	quantity INT NOT NULL,
	country VARCHAR(3) NOT NULL,
	client_id INT NOT NULL,
	user_id INT NOT NULL,
	created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
	updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
	created_by INT NOT NULL,
	updated_by INT NOT NULL,
	deleted BOOLEAN NOT NULL,
	FOREIGN KEY (client_id)
		REFERENCES clients (client_id),
	FOREIGN KEY (user_id)
		REFERENCES users (user_id)
);

DROP TABLE IF EXISTS schedule_days CASCADE;
CREATE TABLE schedule_days
(
	schedule_day_id SERIAL PRIMARY KEY,
	number_day INT NOT NULL,
	schedule_id INT NOT NULL,
	created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
	updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
	created_by INT NOT NULL,
	updated_by INT NOT NULL,
	deleted BOOLEAN NOT NULL,
	FOREIGN KEY (schedule_id)
		REFERENCES schedules (schedule_id)
);

DROP TABLE IF EXISTS schedule_hours CASCADE;
CREATE TABLE schedule_hours
(
	schedule_hour_id SERIAL PRIMARY KEY,
	hour_start TIME NOT NULL,
	hour_end TIME NOT NULL,
	schedule_day_id INT NOT NULL,
	created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
	updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
	created_by INT NOT NULL,
	updated_by INT NOT NULL,
	deleted BOOLEAN NOT NULL,
	FOREIGN KEY (schedule_day_id)
		REFERENCES schedule_days (schedule_day_id)
);

DROP TABLE IF EXISTS drivers CASCADE;
CREATE TABLE drivers
(
	driver_id SERIAL PRIMARY KEY,
	driver_user VARCHAR(50),
	full_name VARCHAR(100),
	created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
	updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
	created_by INT NOT NULL,
	updated_by INT NOT NULL,
	deleted BOOLEAN NOT NULL
);

DROP TABLE IF EXISTS hour_drivers CASCADE;
CREATE TABLE hour_drivers
(
	schedule_hour_id INT NOT NULL,
	driver_id INT NOT NULL,
	assigned_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
	FOREIGN KEY (schedule_hour_id)
		REFERENCES schedule_hours (schedule_hour_id),
	FOREIGN KEY (driver_id)
		REFERENCES drivers (driver_id)
);

INSERT INTO users (user_id,
				   full_name,
				   created_at,
				   updated_at,
				   created_by,
				   updated_by,
				   deleted) 
VALUES(1,
	   'Ramos Travi, Gilberto', 
	   '2022-05-09T04:20:20Z',
	   '2022-05-09T04:20:20Z',
	   0,
	   0,
	   false);

INSERT INTO clients (email,
				   legal_name, 
				   contact_name,
				   created_at,
				   updated_at,
				   created_by,
				   updated_by,
				   deleted) 
VALUES('gramostravi@gmail.com',
	   'Roll Cream SAC',
	   'Ramos Travi, Gilberto',
	   '2022-05-09T04:20:20Z',
	   '2022-05-09T04:20:20Z',
	   0,
	   0,
	   false);

INSERT INTO drivers (driver_user,
					full_name,
				   created_at,
				   updated_at,
				   created_by,
				   updated_by,
				   deleted) 
VALUES('Don Veloz Leonardo Echeverría PE',
		'Leonardo Enrique, Echeverría Villaverde',
	   '2022-05-09T04:20:20Z',
	   '2022-05-09T04:20:20Z',
	   0,
	   0,
	   false);


INSERT INTO drivers (driver_user,
					full_name,
				   created_at,
				   updated_at,
				   created_by,
				   updated_by,
				   deleted) 
VALUES('Don Veloz Par ANGELLO RODRIGUEZ',
		'Angello Alberto, Rodriguez Candela',
	   '2022-05-09T04:20:20Z',
	   '2022-05-09T04:20:20Z',
	   0,
	   0,
	   false);

INSERT INTO drivers (driver_user,
					full_name,
				   created_at,
				   updated_at,
				   created_by,
				   updated_by,
				   deleted) 
VALUES('Don Veloz Zico Martinez PE',
		'Zico, Martinez Yaranga',
	   '2022-05-09T04:20:20Z',
	   '2022-05-09T04:20:20Z',
	   0,
	   0,
	   false);