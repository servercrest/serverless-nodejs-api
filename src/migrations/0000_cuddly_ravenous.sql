CREATE TABLE "leads" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"description" text DEFAULT 'This is my comment',
	"created_at" timestamp DEFAULT now()
);
