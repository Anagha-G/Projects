using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using dotnetapp.Data;
using dotnetapp.Models;
using dotnetapp.Exceptions;

namespace dotnetapp.Services
{
public class FeedbackService
{
    private readonly ApplicationDbContext _context;

    public FeedbackService(ApplicationDbContext context)
    {
        _context = context;
    }

    // Function to retrieve all feedbacks from the database.
    public async Task<IEnumerable<Feedback>> GetAllFeedbacks()
    {
        return await _context.Feedbacks.Include(obj => obj.User).ToListAsync();
    }

    // Retrieve all feedbacks associated with a specific user from the database.
    public async Task<IEnumerable<Feedback>> GetFeedbacksByUserId(int userId)
    {
        return await _context.Feedbacks
                             .Where(f => f.UserId == userId)
                             .ToListAsync();
    }

    // Add new feedback to the database.
    public async Task<bool> AddFeedback(Feedback feedback)
    {
        User user = await _context.Users.FindAsync(feedback.UserId);
        if(user != null){
            feedback.User = user;
        }
        _context.Feedbacks.Add(feedback);
        return await _context.SaveChangesAsync() > 0;
    }

    // Delete specified feedback from the database using FeedbackId.
    public async Task<bool> DeleteFeedback(int feedbackId)
    {
        var feedback = await _context.Feedbacks.FindAsync(feedbackId);
        if (feedback == null)
        {
            return false;
        }

        _context.Feedbacks.Remove(feedback);
        return await _context.SaveChangesAsync() > 0;
    }
}
}
