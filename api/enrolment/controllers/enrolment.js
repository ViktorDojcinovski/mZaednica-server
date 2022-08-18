const { parseMultipartData, sanitizeEntity } = require("strapi-utils");
const readXlsxFile = require("read-excel-file/node");
const dayjs = require("dayjs");
//const { google } = require("googleapis");

module.exports = {
  /**
   * Create a record.
   *
   * @return {Object}
   */
  async create(ctx) {
    if (ctx.is("multipart")) {
      try {
        const { data, files } = parseMultipartData(ctx);
        const { fromDate, duration } = data;
        // Convert to JSON, use the schema for mapping.
        const schema = {
          EMBG: {
            prop: "embg",
            type: String,
          },
          Prezime: {
            prop: "surname",
            type: String,
          },
          Ime: {
            prop: "name",
            type: String,
          },
          "Ime na tatko": {
            prop: "fatherName",
            type: String,
          },
          "Ime na majka": {
            prop: "motherName",
            type: String,
          },
        };
        const { rows, errors } = await readXlsxFile(files.attachment.path, {
          schema,
        });
        // Throw Error when xlsx not parsed correctlly!
        if (errors.length) {
          throw Error("Error parsing xlsx file.", errors);
        }

        // Create starting meeting date+time
        let firstMeeting = {
          meetingDate: fromDate,
          meetingStartTime: new Date(`${fromDate} 09:00`),
          meetingEndTime: new Date(`${fromDate} 09:${duration}`),
        };
        let lastMeetingCreated;
        // Create enrolment requests from rows extracted from .xlsx.
        rows.forEach(async (row) => {
          // create time slot for the meeting and insert it as date+time in enrolment request
          if (!lastMeetingCreated) {
            lastMeetingCreated = { ...firstMeeting };
          } else {
            if (
              new Date(lastMeetingCreated.meetingStartTime).getHours() == "13"
            ) {
              lastMeetingCreated.meetingStartTime = dayjs(
                lastMeetingCreated.meetingStartTime
              )
                .add(1, "day")
                .add(-4, "hour")
                .toISOString();
              lastMeetingCreated.meetingEndTime = dayjs(
                lastMeetingCreated.meetingEndTime
              )
                .add(1, "day")
                .add(-4, "hour")
                .toISOString();
              lastMeetingCreated.meetingDate = dayjs(
                lastMeetingCreated.meetingDate
              )
                .add(1, "day")
                .toISOString();
            } else {
              lastMeetingCreated.meetingStartTime = dayjs(
                lastMeetingCreated.meetingStartTime
              )
                .add(1, "hour")
                .toISOString();
              lastMeetingCreated.meetingEndTime = dayjs(
                lastMeetingCreated.meetingEndTime
              )
                .add(1, "hour")
                .toISOString();
            }
          }

          await strapi.services["enrolment-requests"].create({
            meetingStartTime: lastMeetingCreated.meetingStartTime,
            meetingEndTime: lastMeetingCreated.meetingEndTime,
            meetingDate: lastMeetingCreated.meetingDate,
            educational_facility: ctx.state.user.educational_facility,
            ...row,
          });
        });
        // Create google calendar meetings
        // const client_id = process.env.GOOGLE_CLIENT_ID;
        // const client_secret = process.env.GOOGLE_CLEINT_SECRET;
        // const redirect_uri = process.env.REDIRECT_URI;
        // const oAuth2Client = new google.auth.OAuth2(
        //   client_id,
        //   client_secret,
        //   redirect_uri
        // );
        // rows.forEAch((row) => {
        //   var event = {
        //     summary: "Google I/O 2015",
        //     location: "800 Howard St., San Francisco, CA 94103",
        //     description:
        //       "A chance to hear more about Google's developer products.",
        //     start: {
        //       dateTime: "2015-05-28T09:00:00-07:00",
        //       timeZone: "America/Los_Angeles",
        //     },
        //     end: {
        //       dateTime: "2015-05-28T17:00:00-07:00",
        //       timeZone: "America/Los_Angeles",
        //     },
        //     attendees: [
        //       { email: "lpage@example.com" },
        //       { email: "sbrin@example.com" },
        //     ],
        //     reminders: {
        //       useDefault: false,
        //       overrides: [
        //         { method: "email", minutes: 24 * 60 },
        //         { method: "popup", minutes: 10 },
        //       ],
        //     },
        //   };
        //   strapi.config.functions["gcalendar"].insertEvent(oAuth2Client, event);
        // });
      } catch (error) {
        console.error(error);
      }
    } else {
      return "Missing the .xlsx file";
    }
    // TODO create message on success
    return "Ok";
  },
};
