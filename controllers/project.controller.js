import * as projectModel from "../models/project.model.js"
import * as projectService from "../services/project.service.js"
import userModel from "../models/user.model.js"
import { validationResult } from "express-validator"
// import { updateFileTree as updateFileTreeService } from "../services/project.service.js";

export const createProject = async (req,res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    try {
        const { name } = req.body
        const loggedInUser = await userModel.findOne({ email: req.user.email })
        const userId = loggedInUser._id
        const newProject = await projectService.createProject({
            name, userId
        })
        res.status(201).json(newProject)
    } catch (error) {
        res.status(400).send(error.message)
    }
}
export const getAllProject = async (req, res) => {
    try {

        const loggedInUser = await userModel.findOne({
            email: req.user.email
        })

        const allUserProjects = await projectService.getAllProjectByUserId({
            userId: loggedInUser._id
        })

        return res.status(200).json({
            projects: allUserProjects
        })

    } catch (err) {
        console.log(err)
        res.status(400).json({ error: err.message })
    }
}


export const addUserToProject=async(req,res)=>{
    const errors=validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    try {
        const {projectId,users}=req.body
        const loggedInUser=await userModel.findOne({
            email:req.user.email
        })
        const project=await projectService.addUserToProject({
            projectId,users,
            userId:loggedInUser._id
        })
        return res.status(200).json({
            project
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: error.message })
    }
}
export const getProjectById=async (req,res) => {
    const {projectId}=req.params;
    try {
        const project=await projectService.getProjectById({projectId})

        return res.status(200).json({
            project
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: error.message })
    }
}

export const removeUserFromProject = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { projectId, userId } = req.body;
        const loggedInUser = await userModel.findOne({
            email: req.user.email
        });
        const project = await projectService.removeUserFromProject({
            projectId,
            userId,
            loggedInUserId: loggedInUser._id
        });
        return res.status(200).json({
            project
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
};
export const updateFileTree = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { projectId, file } = req.body;

    if (!projectId || !file || typeof file !== "object") {
        return res.status(400).json({ error: "Valid projectId and file object are required" });
    }

    try {
        // 🟢 **Calling the service function** here
        const updatedProject = await projectService.updateFileTree(projectId, file);
        
        return res.status(200).json({ message: "File added successfully", updatedProject });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};