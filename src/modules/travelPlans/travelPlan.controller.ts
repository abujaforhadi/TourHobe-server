import { Request, Response } from "express";
import * as travelService from "./travelPlan.service";
import { prisma } from "../../config/db";

/* ===================== TYPES ===================== */

interface AuthUser {
  id: string;
  role: "USER" | "ADMIN";
}

interface AuthRequest extends Request {
  user?: AuthUser;
}

/* ===================== CREATE ===================== */

export async function createPlan(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const plan = await travelService.createPlan(
      req.user.id,
      req.body
    );

    return res.json({ success: true, plan });
  } catch (err: any) {
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Failed",
    });
  }
}

/* ===================== GET ONE ===================== */

export async function getPlan(req: Request, res: Response) {
  try {
    const plan = await travelService.getPlan(req.params.id);

    return res.json({ success: true, plan });
  } catch (err: any) {
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Failed",
    });
  }
}

/* ===================== LIST (PAGINATION) ===================== */

export async function listPlans(req: Request, res: Response) {
  try {
    const result = await travelService.listPlansWithPagination({
      page: Number(req.query.page),
      limit: Number(req.query.limit),
      destination: req.query.destination as string,
      travelType: req.query.travelType as string,
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
    });

    return res.json({ success: true, ...result });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed",
    });
  }
}

/* ===================== MATCH ===================== */

export async function match(req: Request, res: Response) {
  try {
    const matches = await travelService.matchPlans({
      destination: req.query.destination as string,
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
      travelType: req.query.travelType as string,
    });

    return res.json({ success: true, matches });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to match plans",
    });
  }
}

/* ===================== DELETE ===================== */

export async function removePlan(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const result = await travelService.deletePlan(
      req.params.id,
      req.user.id,
      req.user.role === "ADMIN"
    );

    return res.json({ success: true, ...result });
  } catch (err: any) {
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Failed",
    });
  }
}

/* ===================== UPDATE ===================== */

export async function updatePlan(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const result = await travelService.updatePlan(
      req.params.id,
      req.user.id,
      req.body,
      req.user.role === "ADMIN"
    );

    return res.json({ success: true, ...result });
  } catch (err: any) {
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Failed",
    });
  }
}

/* ===================== JOIN ===================== */

export async function requestToJoin(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const result = await travelService.requestToJoinPlan(
      req.params.id,
      req.user.id
    );

    return res.json({ success: true, ...result });
  } catch (err: any) {
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Failed",
    });
  }
}

/* ===================== RESPOND ===================== */

export async function respondParticipant(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { status } = req.body;

    if (!["ACCEPTED", "REJECTED", "CANCELLED"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const result = await travelService.respondToJoinRequest(
      req.params.planId,
      req.user.id,
      req.params.participantId,
      status
    );

    return res.json({ success: true, ...result });
  } catch (err: any) {
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Failed",
    });
  }
}

/* ===================== MY PLANS ===================== */

export async function getMyPlans(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const plans = await prisma.travelPlan.findMany({
      where: { hostId: req.user.id },
      orderBy: { createdAt: "desc" },
    });

    return res.json({ success: true, plans });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to load plans",
    });
  }
}
