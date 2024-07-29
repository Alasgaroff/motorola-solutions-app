psql -U khayalalasgaroff -d motorola_solutions_db

psql -U khayalalasgaroff -d motorola_test_database

psql -U khayalalasgaroff -d postgres

brew services restart postgresql



CREATE TABLE "Orders" (
  id SERIAL PRIMARY KEY,
  customerName VARCHAR(255) NOT NULL,
  totalAmount DOUBLE PRECISION NOT NULL,
  createdAt TIMESTAMPTZ NOT NULL DEFAULT now(),
  updatedAt TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE "Products" (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DOUBLE PRECISION NOT NULL,
  createdAt TIMESTAMPTZ NOT NULL DEFAULT now(),
  updatedAt TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE "OrderProducts" (
  id SERIAL PRIMARY KEY,
  quantity INTEGER NOT NULL,
  "orderId" INTEGER NOT NULL,
  "productId" INTEGER NOT NULL,
  createdAt TIMESTAMPTZ NOT NULL DEFAULT now(),
  updatedAt TIMESTAMPTZ NOT NULL DEFAULT now(),
  FOREIGN KEY ("orderId") REFERENCES "Orders" ("id"),
  FOREIGN KEY ("productId") REFERENCES "Products" ("id")
);
