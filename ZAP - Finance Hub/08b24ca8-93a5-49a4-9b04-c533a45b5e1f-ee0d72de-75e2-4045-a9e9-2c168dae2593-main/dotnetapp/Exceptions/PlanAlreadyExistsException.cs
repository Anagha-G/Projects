using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace dotnetapp.Exceptions
{
    public class PlanAlreadyExistsException : Exception
    {
        public PlanAlreadyExistsException() : base() {}

        public PlanAlreadyExistsException(string message): base(message)
        {
            
        }
    }
}