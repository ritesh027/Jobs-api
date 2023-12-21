const Job = require('../models/Job');
const {statusCodes} = require('http-status-codes');
const {BadRequestError, NotFoundError} = require('../errors');


const getAllJobs = async (req, res) => {
    const jobs = await Job.find({createdBy: req.user.userId}).sort('createdAt');
    // console.log(jobs);
    res.status(200).json({jobs, count: jobs.length});


}

const getJob = async (req, res) => {
    const {
        user:{userId}, 
        params:{id:jobId}
        } = req;

    const job = await Job.findOne({
        _id:jobId, createdBy:userId
    })
    if(!job)
    {
        throw new NotFoundError(`No jobs exist for ${user.name} with job id ${jobId}`);
    }
    return res.status(200).json({job});
}

const createJob = async (req, res) => {
    const {company, position, status} = req.body;
    const userId = req.user.userId;
    const tempJob = {company, position, createdBy: userId};
    // console.log(tempJob);
    const newjob = await Job.create({...tempJob});
    // console.log(newjob);
    res.status(201).json(newjob);
}

const updateJob = async (req, res) => {
    const {
        body: {company, position},
        user:{userId}, 
        params:{id:jobId}
        } = req;

    if(company === '' || position === '')
    {
        throw new BadRequestError('Company or Position cannot be empty');
    }
    const job = await Job.findByIdAndUpdate(
        {_id: jobId, createdBy: userId},
        req.body,
        {new: true, runValidators: true}
        )
    if(!job)
    {
        throw new NotFoundError('Cant update the Job');
    }

    res.status(200).json(job);
}

const deleteJob = async (req, res) => {
    const {
        user:{userId}, 
        params:{id:jobId}
        } = req;
    
        const job = await Job.findByIdAndRemove(
            {_id:jobId, createdBy: userId}
        )

    if(!job)
    {
        throw new NotFoundError('Cant Delete the Job');
    }

    res.status(200).send('successfully deleted the job');

        
}

module.exports = {
    getAllJobs, 
    getJob,
    createJob,
    updateJob,
    deleteJob
};