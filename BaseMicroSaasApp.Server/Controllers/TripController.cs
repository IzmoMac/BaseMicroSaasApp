using BaseMicroSaasApp.Server.Models;
using Microsoft.AspNetCore.Mvc;

namespace BaseMicroSaasApp.Server.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class TripController : Controller
    {
        [HttpPost("record")]
        public async Task<IActionResult> Record([FromBody] TripForm form)
        {

            return Ok("Data Submitted Successfully");
        }
    }
}
