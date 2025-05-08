using BaseMicroSaasApp.Server.Models;
using Microsoft.AspNetCore.Mvc;

namespace BaseMicroSaasApp.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FillupController : Controller
{
    [HttpPost("record")]
    public async Task<IActionResult> Record([FromBody] FillupForm form)
    {
        // Simulate a long-running task
        
        

        return Ok("Data Submitted Successfully");
    }
}
