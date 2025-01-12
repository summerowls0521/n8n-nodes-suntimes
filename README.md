# n8n-nodes-suntimes

This is a n8n node that gets various periods of the day for a given date.

It adds the following properties to the supplied items:

- solarNoon
- nadir
- sunrise
- sunset
- sunriseEnd
- sunsetStart
- dawn
- dusk
- nauticalDawn
- nauticalDusk
- nightEnd
- night
- goldenHourEnd
- goldenHour

These should be mostly self-explanatory. For more details see the readme for the
library that does the work [here](https://www.npmjs.com/package/suncalc).

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Compatibility](#compatibility)  
[Resources](#resources)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Compatibility

This node was developed for 1.73.1 and is not guaranteed to work with any other
version. Then again, it just might!

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
