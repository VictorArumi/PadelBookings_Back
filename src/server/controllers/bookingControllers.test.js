const Booking = require("../../database/models/Booking");
const {
  mockBookings,
  mockNewBookingBody,
} = require("../../mocks/mockBookings");
const {
  getBookings,
  deleteBooking,
  createBooking,
  editBooking,
  getBooking,
  editBookingPlayers,
  getBookingAndPlayersUsernames,
} = require("./bookingsControllers");

const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

jest.mock("../../database/models/Booking", () => ({
  ...jest.requireActual("../../database/models/Booking"),
  skip: jest.fn().mockResolvedValue([
    {
      club: "RCPB",
      owner: "6299261c885d2211475ec5ec",
      date: "12/05/2622",
      hour: "20",
      courtType: "Outdoor",
      players: [],
      id: "629a19fe5a16e50d33d55cc3",
    },
    {
      club: "otroclub",
      owner: "6299261c885d2211475ec5ec",
      date: "12/05/1922",
      hour: "5",
      courtType: "Indoor",
      players: [],
      id: "629a19fe5a16e50d33d55cc3",
    },
  ]),
  limit: jest.fn().mockReturnThis(),
  find: jest.fn().mockReturnThis(),
}));

const next = jest.fn();

describe("Given a getBookings function", () => {
  describe("When it's invoked with a request with limit and page params, and type,status,date,user", () => {
    test("Then it should call the response's method status with a 200, and json method with a list of bookings", async () => {
      const expectedStatusCode = 200;
      const req = {
        params: {
          limit: 2,
          page: 1,
        },
        query: {
          type: "Outdoor",
          status: true,
          date: "25/10/2022",
          user: "6299261c885d2211475ec5ec",
          owner: "6299261c885d2211475ec5ec",
        },
      };

      await getBookings(req, res, null);

      expect(res.status).toHaveBeenCalledWith(expectedStatusCode);
      expect(res.json).toHaveBeenCalledWith({
        bookings: [mockBookings[2], mockBookings[3]],
      });
    });
  });

  describe("When it's invoked with a request with falsy page", () => {
    test("Then it should call the response's method status with a 200, and json method with a list of bookings", async () => {
      const expectedError = new Error();
      const req = {
        params: {
          limit: 2,
          page: false,
        },
        query: {
          type: "Outdoor",
          status: true,
          date: "25/10/2022",
          user: "6299261c885d2211475ec5ec",
          owner: "6299261c885d2211475ec5ec",
        },
      };

      await getBookings(req, res, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When the query gives an error", () => {
    test("Then it should call next with an error", async () => {
      const req = {
        params: {
          limit: 2,
          page: 1,
        },
        query: {
          type: "Outdoor",
          status: true,
          date: "25/10/2022",
          user: "6299261c885d2211475ec5ec",
          owner: "6299261c885d2211475ec5ec",
        },
      };

      const expectedError = new Error();

      Booking.find = jest.fn().mockResolvedValue(null);

      await getBookings(req, res, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});

describe("Given a getBooking function", () => {
  describe("When it's invoked with a request with valid id in params", () => {
    test("Then it should call next", async () => {
      const req = {
        params: { id: "testId" },
      };

      Booking.findById = jest.fn().mockResolvedValue(mockBookings[2]);
      await getBooking(req, null, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("When it's invoked with a request with no id in params", () => {
    test("Then it should call next", async () => {
      const req = {};

      Booking.findById = jest.fn().mockResolvedValue(mockBookings[2]);
      await getBooking(req, null, next);

      expect(next).toHaveBeenCalled();
    });
  });
});

describe("Given a getBookingAndPlayersUsernames function", () => {
  describe("When it's invoked with valid id", () => {
    test("Then it should call the response's method status with a 200, and json method with the booking and the players usernames", async () => {
      const req = {
        params: { id: "testId" },
        booking: mockBookings[2],
      };
      const playersUsernames = ["name1", "name2", "name3", "name4"];
      const expectedStatusCode = 200;

      Booking.findById = jest.fn(() => ({
        populate: jest.fn().mockReturnValue({
          ...mockBookings[2],
          players: [
            { username: "name1" },
            { username: "name2" },
            { username: "name3" },
            { username: "name4" },
          ],
        }),
      }));

      await getBookingAndPlayersUsernames(req, res, null);

      expect(res.status).toHaveBeenCalledWith(expectedStatusCode);
      expect(res.json).toHaveBeenCalledWith({
        booking: mockBookings[2],
        playersUsernames,
      });
    });
  });
});

describe("Given a deleteBooking function", () => {
  describe("When it's invoked with params id: deleteThisId", () => {
    test("Then it should call the response's method status with a 200, and json with msg: Item with id idTodelete has been deleted", async () => {
      const idTodelete = "deleteThisId";
      const expectedJson = {
        msg: `Item with id ${idTodelete} has been deleted`,
      };
      const req = {
        params: { id: idTodelete },
      };
      const expectedStatusCode = 200;
      Booking.findByIdAndDelete = jest.fn().mockResolvedValue(true);

      await deleteBooking(req, res);

      expect(res.status).toHaveBeenCalledWith(expectedStatusCode);
      expect(res.json).toHaveBeenCalledWith(expectedJson);
    });
  });

  describe("When it's invoked with an id that doesn't exist", () => {
    test("Then it should call next with an error", async () => {
      const idTodelete = "deleteThisId";

      const req = {
        params: { id: idTodelete },
      };

      const expectedError = new Error();

      Booking.findByIdAndDelete = jest.fn().mockResolvedValue(null);

      await deleteBooking(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When it's invoked with no id", () => {
    test("Then it should call next with an error", async () => {
      const req = {};

      const expectedError = new Error();

      await deleteBooking(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});

describe("Given a createBooking function", () => {
  describe("When it's called with a request with valid new booking object", () => {
    test("Then it should call the response's method status with a 201, and json method with object with property createdBooking with createdbooking inside", async () => {
      const req = {
        body: mockNewBookingBody,
      };
      const mockId = "thisIsAMockId";
      const expectedJson = {
        createdBooking: { ...mockNewBookingBody, id: mockId },
      };
      const expectedStatus = 201;

      Booking.create = jest
        .fn()
        .mockResolvedValue({ ...mockNewBookingBody, id: mockId });
      await createBooking(req, res, null);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith(expectedJson);
    });
  });

  describe("When it's called with a request with invalid new booking object", () => {
    test("Then it should call next with an error", async () => {
      const req = {};

      const expectedError = new Error();
      Booking.create = jest.fn().mockRejectedValue(expectedError);
      await createBooking(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});

describe("Given a editBooking function", () => {
  describe("When it's invoked with params id: editThisId", () => {
    test("Then it should call the response's method status with a 200, and json with property updatedBooking with the updated booking", async () => {
      const idToEdit = mockBookings[0].id;
      const expectedJson = {
        updatedBooking: { ...mockBookings[0], club: "New Club" },
      };
      const req = {
        params: { id: idToEdit },
        body: { ...mockBookings[0], club: "New Club" },
      };
      const expectedStatusCode = 200;
      Booking.findByIdAndUpdate = jest
        .fn()
        .mockResolvedValue({ ...mockBookings[0], club: "New Club" });

      await editBooking(req, res);

      expect(res.status).toHaveBeenCalledWith(expectedStatusCode);
      expect(res.json).toHaveBeenCalledWith(expectedJson);
    });
  });

  describe("When it's called with a request with invalid updated booking object", () => {
    test("Then it should call next with an error", async () => {
      const idToEdit = mockBookings[0].id;

      const req = { params: { id: idToEdit } };

      const expectedError = new Error();
      Booking.findByIdAndUpdate = jest.fn().mockRejectedValue(expectedError);
      await editBooking(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});

describe("Given a editBookingPlayers function", () => {
  describe("When it's invoked with params id: editThisId and a array of players", () => {
    test("Then it should call the response's method status with a 200, and json with property updatedBooking with the updated booking with a new player in the players array", async () => {
      const idToEdit = mockBookings[0].id;
      const expectedJson = {
        updatedBooking: {
          ...mockBookings[0],
          players: ["62a3a6358875bd6b7be217b0", "62a370a93425175ce845e6d3"],
        },
      };
      const req = {
        params: { id: idToEdit },
        body: ["62a3a6358875bd6b7be217b0", "62a370a93425175ce845e6d3"],
      };
      const expectedStatusCode = 200;
      Booking.findByIdAndUpdate = jest.fn().mockResolvedValue({
        ...mockBookings[0],
        players: ["62a3a6358875bd6b7be217b0", "62a370a93425175ce845e6d3"],
      });

      await editBookingPlayers(req, res);

      expect(res.status).toHaveBeenCalledWith(expectedStatusCode);
      expect(res.json).toHaveBeenCalledWith(expectedJson);
    });
  });

  describe("When it's invoked with params id: editThisId and a array of players", () => {
    test("Then it should call the response's method status with a 200, and json with property updatedBooking with the updated booking with a new player in the players array", async () => {
      const req = {
        params: {},
        body: {},
      };

      const expectedError = new Error();
      Booking.findByIdAndUpdate = jest.fn().mockRejectedValue(expectedError);

      await editBookingPlayers(req, res, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});
