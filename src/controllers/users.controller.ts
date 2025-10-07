import type { Request, Response } from "express";
import User from "../models/user.model";
import Role from "../models/role.model";

/**
 * GET /users
 * Protegido (ADMIN)
 * Query params:
 *  - page=1
 *  - limit=10
 *  - q (search en username | email, regex, case-insensitive)
 *  - role (ADMIN | USER)
 *  - status (ACTIVE | PENDING | BANNED)
 *  - sort=campo:dir  (ej: createdAt:desc  | username:asc)
 */
export async function listUsers(req: Request, res: Response) {
  // sane defaults
  const page = Math.max(parseInt((req.query.page as string) || "1", 10), 1);
  const limit = Math.min(
    Math.max(parseInt((req.query.limit as string) || "10", 10), 1),
    100
  );

  const q = (req.query.q as string) || "";
  const roleName = (req.query.role as string) || ""; // ADMIN | USER
  const status = (req.query.status as string) || ""; // ACTIVE | PENDING | BANNED
  const sortRaw = (req.query.sort as string) || "createdAt:desc";

  // sort parsing
  const [sortField, sortDirRaw] = sortRaw.split(":");
  const sortDir = (sortDirRaw || "desc").toLowerCase() === "asc" ? 1 : -1;
  const sort: Record<string, 1 | -1> = { [sortField || "createdAt"]: sortDir };

  // base filter
  const filter: any = {};

  if (q) {
    filter.$or = [
      { username: { $regex: q, $options: "i" } },
      { email: { $regex: q, $options: "i" } },
    ];
  }

  if (status) filter.status = status;

  if (roleName) {
    const role = await Role.findOne({ name: roleName });
    // si existe el rol, filtramos por roleId; si no, devolvemos vacío
    filter.roleId = role ? role.id : "no_role_matches_";
  }

  const [total, users] = await Promise.all([
    User.countDocuments(filter),
    User.find(filter)
      .select("-passwordHash")
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit),
  ]);

  return res.status(200).json({
    meta: {
      page,
      limit,
      total,
      pages: Math.max(Math.ceil(total / limit), 1),
      sort: sortRaw,
      filters: { q, role: roleName, status },
    },
    data: users,
  });
}