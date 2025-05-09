using BaseMicroSaasApp.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BaseMicroSaasApp.Server.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TripController : Controller
    {
        [HttpPost("record")]
        public async Task<IActionResult> Record([FromBody] TripForm form)
        {
            //TODO Add validation and save to database
            return Ok("Data Submitted Successfully");
        }
    }
}
