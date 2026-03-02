import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Error "mo:core/Error";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Initialize the authorization component
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  public type UserProfile = {
    firstName : Text;
    lastName : Text;
    phone : Text;
    email : ?Text;
    address : ?Text;
    password : Text; // In production, use a secure hash instead of plaintext
  };

  // Storage for user profiles
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Get the caller's own profile
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      throw Error.reject("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  // Get any user's profile (own profile or admin viewing others)
  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      throw Error.reject("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  // Save the caller's own profile
  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      throw Error.reject("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Implement additional marketplace logic here (CRUD for stores, products, orders, etc.)
  // Example structure for future implementation:

  // Store Management (would require admin or store owner authorization)
  // public shared ({ caller }) func createStore(...) : async () {
  //   if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
  //     throw Error.reject("Unauthorized: Only users can create stores");
  //   };
  //   // Store creation logic
  // };

  // Product Management (would require store owner or admin authorization)
  // public shared ({ caller }) func addProduct(...) : async () {
  //   if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
  //     throw Error.reject("Unauthorized: Only users can add products");
  //   };
  //   // Product creation logic with ownership check
  // };

  // Order Management (would require user authorization)
  // public shared ({ caller }) func placeOrder(...) : async () {
  //   if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
  //     throw Error.reject("Unauthorized: Only users can place orders");
  //   };
  //   // Order placement logic
  // };

  // Admin-only order status updates
  // public shared ({ caller }) func updateOrderStatus(...) : async () {
  //   if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
  //     throw Error.reject("Unauthorized: Only admins can update order status");
  //   };
  //   // Order status update logic
  // };
};
