-- CreateTable
CREATE TABLE "users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "username" TEXT,
    "password_hash" TEXT,
    "is_confirmed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "services" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "display_name" TEXT,
    "description" TEXT,
    "requires_oauth" BOOLEAN NOT NULL DEFAULT false,
    "oauth_config" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "user_services" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "service_id" INTEGER NOT NULL,
    "oauth_token" TEXT,
    "config" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "user_services_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "user_services_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "actions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "service_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "display_name" TEXT,
    "description" TEXT,
    "parameters_schema" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "actions_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "reactions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "service_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "display_name" TEXT,
    "description" TEXT,
    "parameters_schema" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "reactions_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "areas" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "action_id" INTEGER NOT NULL,
    "action_service_id" INTEGER NOT NULL,
    "action_params" TEXT,
    "reaction_id" INTEGER NOT NULL,
    "reaction_service_id" INTEGER NOT NULL,
    "reaction_params" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_triggered" DATETIME,
    CONSTRAINT "areas_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "areas_action_id_fkey" FOREIGN KEY ("action_id") REFERENCES "actions" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "areas_action_service_id_fkey" FOREIGN KEY ("action_service_id") REFERENCES "user_services" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "areas_reaction_id_fkey" FOREIGN KEY ("reaction_id") REFERENCES "reactions" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "areas_reaction_service_id_fkey" FOREIGN KEY ("reaction_service_id") REFERENCES "user_services" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "executions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "area_id" INTEGER NOT NULL,
    "trigger_data" TEXT,
    "status" TEXT NOT NULL DEFAULT 'success',
    "error_message" TEXT,
    "executed_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "executions_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "areas" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "services_name_key" ON "services"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_services_user_id_service_id_key" ON "user_services"("user_id", "service_id");

-- CreateIndex
CREATE UNIQUE INDEX "actions_service_id_name_key" ON "actions"("service_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "reactions_service_id_name_key" ON "reactions"("service_id", "name");
