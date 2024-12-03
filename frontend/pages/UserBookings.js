export default {
    template: `
    <div class="user-bookings-container">
    <h1 class="user-bookings-title">My Bookings</h1>

    <div class="mb-3">
        <label for="statusFilter" class="form-label">Filter by status:</label>
        <select id="statusFilter" v-model="selectedStatus" @change="fetchBookings" class="form-control">
            <option value="">All</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Rejected">Rejected</option>
            <option value="Completed">Completed</option>
        </select>
    </div>

    <div v-if="isLoading" class="loading-text">Loading...</div>
    <div v-else-if="error" class="error-text">{{ error }}</div>
    <div v-else>
        <table class="table" style="width: 1300px;">
            <thead>
                <tr>
                    <th>Service</th>
                    <th>Employee</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="booking in filteredBookings" :key="booking.id">
                    <td>{{ booking.service.name }}</td>
                    <td>{{ booking.employee.name }}</td>
                    <td>{{ booking.date }}</td>
                    <td>{{ booking.status }}</td>
                    <td>
                        <button :class="{'btn btn-primary': true}" :disabled="booking.status === 'Pending' || booking.status === 'Rejected' || booking.status === 'Completed'" @click="openRatingModal(booking.id)">
                            Complete
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- Rating Modal -->
    <div class="modal fade" id="ratingModal" tabindex="-1" aria-labelledby="ratingModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="ratingModalLabel">Rate the Service</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="rating">
                        <span v-for="star in 5" :key="star" @click="setRating(star)" :class="{'text-warning': star <= rating, 'text-muted': star > rating}">
                            <i class="bi bi-star-fill"></i>
                        </span>
                    </div>
                    <textarea v-model="review" class="form-control mt-3" placeholder="Write your review here..."></textarea>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" @click="submitRating">Submit</button>
                </div>
            </div>
        </div>
    </div>
</div>

    `,
    data() {
        return {
            bookings: [],
            selectedStatus: '',
            isLoading: false,
            error: null,
            rating: 0,
            review: '',
            currentBookingId: null,
        };
    },
    computed: {
        filteredBookings() {
            if (this.selectedStatus) {
                return this.bookings.filter(booking => booking.status === this.selectedStatus);
            }
            return this.bookings;
        }
    },
    methods: {
        async fetchBookings() {
            this.isLoading = true;
            this.error = null;

            try {
                const res = await fetch(`${location.origin}/api/bookings`, {
                    headers: {
                        'Authentication-Token': this.$store.state.auth_token
                    }
                });

                if (!res.ok) {
                    throw new Error(`Failed to fetch bookings: HTTP ${res.status}`);
                }

                this.bookings = await res.json();
            } catch (error) {
                console.error('Error fetching bookings:', error);
                this.error = 'Could not fetch the bookings. Please try again later.';
            } finally {
                this.isLoading = false;
            }
        },
        openRatingModal(bookingId) {
            this.currentBookingId = bookingId;
            this.rating = 0;
            this.review = '';
            const modal = new bootstrap.Modal(document.getElementById('ratingModal'));
            modal.show();
        },
        setRating(star) {
            this.rating = star;
        },
        async submitRating() {
            try {
                const res = await fetch(`${location.origin}/api/bookings/${this.currentBookingId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authentication-Token': this.$store.state.auth_token
                    },
                    body: JSON.stringify({ status: 'Completed', rating: this.rating, review: this.review })
                });

                if (!res.ok) {
                    throw new Error(`Failed to update booking status: HTTP ${res.status}`);
                }

                alert('Booking status updated and rating submitted');
                // Update the booking status in the local state
                const updatedBooking = this.bookings.find(booking => booking.id === this.currentBookingId);
                if (updatedBooking) {
                    updatedBooking.status = 'Completed';
                    updatedBooking.rating = this.rating;
                    updatedBooking.review = this.review;
                }
                // Hide the modal
                const modalElement = document.getElementById('ratingModal');
                const modal = bootstrap.Modal.getInstance(modalElement);
                modal.hide();
            } catch (error) {
                console.error('Error updating booking status:', error);
                alert('Could not update the booking status. Please try again later.');
            }
        }
    },
    async mounted() {
        await this.fetchBookings();
    }
}