import { Request, Response } from "express";
import * as travelService from "./travelPlan.service";
import { prisma } from "../../config/db";

interface AuthRequest extends Request {
  user: {
    id: string;
    role: string;
  };
}

/* ===================== CREATE PLAN ===================== */
export async function createPlan(req: AuthRequest, res: Response) {
  try {
    const { id: hostId } = req.user;

    const plan = await travelService.createPlan(hostId, req.body);

    return res.status(201).json({
      success: true,
      message: "Travel plan created successfully",
      plan,
    });
  } catch (error: any) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to create travel plan",
    });
  }
}

/* ===================== GET SINGLE PLAN ===================== */
export async function getPlan(req: Request, res: Response) {
  try {
    const plan = await travelService.getPlan(req.params.id);

    return res.json({
      success: true,
      plan,
    });
  } catch (error: any) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Travel plan not found",
    });
  }
}

/* ===================== LIST PLANS (PAGINATION) ===================== */
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

    return res.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch travel plans",
    });
  }
}

/* ===================== MATCH PLANS ===================== */
export async function match(req: Request, res: Response) {
  try {
    const matches = await travelService.matchPlans({
      destination: req.query.destination as string,
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
      travelType: req.query.travelType as string,
    });

    return res.json({
      success: true,
      matches,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to match plans",
    });
  }
}

/* ===================== DELETE PLAN ===================== */
export async function removePlan(req: AuthRequest, res: Response) {
  try {
    const { id: userId, role } = req.user;

    const result = await travelService.deletePlan(
      req.params.id,
      userId,
      role === "ADMIN"
    );

    return res.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to delete plan",
    });
  }
}

/* ===================== UPDATE PLAN ===================== */
export async function updatePlan(req: AuthRequest, res: Response) {
  try {
    const { id: userId, role } = req.user;

    const result = await travelService.updatePlan(
      req.params.id,
      userId,
      req.body,
      role === "ADMIN"
    );

    return res.json({
      success: true,
      message: "Plan updated successfully",
      plan: result.plan,
    });
  } catch (error: any) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to update plan",
    });
  }
}

/* ===================== JOIN PLAN ===================== */
export async function requestToJoin(req: AuthRequest, res: Response) {
  try {
    const result = await travelService.requestToJoinPlan(
      req.params.id,
      req.user.id
    );

    return res.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to send join request",
    });
  }
}

/* ===================== RESPOND TO JOIN REQUEST ===================== */
export async function respondParticipant(req: AuthRequest, res: Response) {
  try {
    const { planId, participantId } = req.params;
    const { status } = req.body;

    const result = await travelService.respondToJoinRequest(
      planId,
      req.user.id,
      participantId,
      status
    );

    return res.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to update request status",
    });
  }
}

/* ===================== GET MY PLANS ===================== */
export async function getMyPlans(req: AuthRequest, res: Response) {
  try {
    const plans = await prisma.travelPlan.findMany({
      where: { hostId: req.user.id },
      orderBy: { createdAt: "desc" },
    });

    return res.json({
      success: true,
      plans,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to load plans",
    });
  }
}
