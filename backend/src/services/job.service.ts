// src/services/job.service.ts

import prisma from '../config/database.config';
import { Job } from '../interfaces/job.interface';
import { JobType } from '../enums/enums';

/**
 * Helper function to map Prisma Job to custom Job interface
 */
const mapToJob = (prismaJob: any): Job => {
  return {
    id: prismaJob.id,
    companyId: prismaJob.companyId,
    company: prismaJob.company,
    jobFieldId: prismaJob.jobFieldId,
    jobField: prismaJob.jobField,
    title: prismaJob.title,
    type: prismaJob.type as JobType,
    vacancies: prismaJob.vacancies,
    deadline: prismaJob.deadline,
    datePublished: prismaJob.datePublished,
    yearsOfExperience: prismaJob.yearsOfExperience,
    description: prismaJob.description,
    salaryRange: prismaJob.salaryRange || null,
    applications: prismaJob.applications || [],
    createdAt: prismaJob.createdAt,
    updatedAt: prismaJob.updatedAt,
    isDeleted: prismaJob.isDeleted,
  };
};

/**
 * Create Job
 */
export const createJob = async (jobData: any): Promise<Job | null> => {
  try {
    const newJob = await prisma.job.create({
      data: {
        companyId: jobData.companyId,
        jobFieldId: jobData.jobFieldId,
        title: jobData.title,
        type: jobData.type,
        vacancies: jobData.vacancies,
        deadline: jobData.deadline,
        datePublished: jobData.datePublished || new Date(),
        yearsOfExperience: jobData.yearsOfExperience,
        description: jobData.description,
        salaryRange: jobData.salaryRange || null,
      },
      include: {
        company: true,
        jobField: true,
        applications: true,
      },
    });
    return mapToJob(newJob);
  } catch (error) {
    throw new Error('Error creating Job');
  }
};

/**
 * Get Job by ID
 */
export const getJobById = async (jobId: string): Promise<Job | null> => {
  try {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        company: true,
        jobField: true,
        applications: true,
      },
    });

    return job && !job.isDeleted ? mapToJob(job) : null;
  } catch (error) {
    throw new Error('Error retrieving Job by ID');
  }
};

/**
 * Update Job
 */
export const updateJob = async (jobId: string, jobData: Partial<Job>): Promise<Job | null> => {
  try {
    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: {
        title: jobData.title,
        type: jobData.type,
        vacancies: jobData.vacancies,
        deadline: jobData.deadline,
        yearsOfExperience: jobData.yearsOfExperience,
        description: jobData.description,
        salaryRange: jobData.salaryRange || null,
      },
      include: {
        company: true,
        jobField: true,
        applications: true,
      },
    });
    return mapToJob(updatedJob);
  } catch (error) {
    throw new Error('Error updating Job');
  }
};

/**
 * Soft delete Job
 */
export const deleteJob = async (jobId: string): Promise<boolean> => {
  try {
    await prisma.job.update({
      where: { id: jobId },
      data: { isDeleted: true },
    });
    return true;
  } catch (error) {
    throw new Error('Error soft deleting Job');
  }
};

/**
 * Get All Jobs with filtering options
 */
export const getAllJobs = async (filters: any = {}): Promise<Job[]> => {
  try {
    const { jobFieldId, companyId, title, location } = filters;

    const jobs = await prisma.job.findMany({
      where: {
        isDeleted: false,
        jobFieldId: jobFieldId || undefined,
        companyId: companyId || undefined,
        title: title ? { contains: title, mode: 'insensitive' } : undefined,
      },
      include: {
        company: true,
        jobField: true,
        applications: true,
      },
    });

    return jobs.map(mapToJob);
  } catch (error) {
    throw new Error('Error retrieving all Jobs');
  }
};

/**
 * Get Jobs by Company
 */
export const getJobsByCompany = async (companyId: string): Promise<Job[]> => {
  try {
    const jobs = await prisma.job.findMany({
      where: { companyId, isDeleted: false },
      include: {
        company: true,
        jobField: true,
        applications: true,
      },
    });
    return jobs.map(mapToJob);
  } catch (error) {
    throw new Error('Error retrieving Jobs by Company');
  }
};

/**
 * Get Jobs by Job Field
 */
export const getJobsByJobField = async (jobFieldId: string): Promise<Job[]> => {
  try {
    const jobs = await prisma.job.findMany({
      where: { jobFieldId, isDeleted: false },
      include: {
        company: true,
        jobField: true,
        applications: true,
      },
    });
    return jobs.map(mapToJob);
  } catch (error) {
    throw new Error('Error retrieving Jobs by Job Field');
  }
};
