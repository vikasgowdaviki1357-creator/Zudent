import { useContext, useEffect, useMemo, useState } from "react";



import {

  Search,

  Plus,

  Heart,

  ShoppingBag,

  Gift,

  X,

  MessageCircle,

  MapPin,

  User,

  Package,

  Loader2,

  RefreshCw,

} from "lucide-react";


import { AuthContext } from "../../context/AuthContext";





const categories = [

  "All",

  "Books",

  "Notes",

  "Calculators",

  "Lab Items",

  "Tools",

  "Question Papers",

  "Electronics",

];



const conditions = [

  "New",

  "Like New",

  "Good",

  "Fair",

];





function Marketplace() {

  const { authFetch, user } = useContext(AuthContext);



  const [products, setProducts] = useState([]);



  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("All");

  const [listingType, setListingType] = useState("All");



  const [view, setView] = useState("Browse");



  const [selectedProduct, setSelectedProduct] =

    useState(null);



  const [showSellModal, setShowSellModal] =

    useState(false);



  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] =

    useState(false);



  const [error, setError] = useState("");



  const [wishlistLoading, setWishlistLoading] =

    useState(null);



  const [creating, setCreating] =

    useState(false);





  /*

   * =====================================================

   * LOAD MARKETPLACE

   * =====================================================

   */



  const loadMarketplace = async (

    showRefresh = false

  ) => {

    try {

      if (showRefresh) {

        setRefreshing(true);

      } else {

        setLoading(true);

      }



      setError("");



      const params = new URLSearchParams();



      if (category !== "All") {

        params.append(

          "category",

          category

        );

      }



      if (listingType !== "All") {

        params.append(

          "type",

          listingType.toLowerCase()

        );

      }



      if (search.trim()) {

        params.append(

          "search",

          search.trim()

        );

      }



      const query = params.toString();



      const response = await authFetch(

        `/api/student/marketplace${

          query ? `?${query}` : ""

        }`

      );



      const result =

        await response.json();



      if (!response.ok) {

        throw new Error(

          result.message ||

            "Failed to load marketplace."

        );

      }



      setProducts(

        Array.isArray(result.data)

          ? result.data

          : []

      );



    } catch (err) {

      console.error(

        "Marketplace loading error:",

        err

      );



      setError(

        err.message ||

          "Unable to load marketplace."

      );



    } finally {

      setLoading(false);

      setRefreshing(false);

    }

  };





  /*

   * Load marketplace whenever

   * search/category/type changes.

   */



  useEffect(() => {

    const timer =

      setTimeout(() => {

        loadMarketplace();

      }, 300);



    return () =>

      clearTimeout(timer);



  }, [

    category,

    listingType,

    search,

  ]);





  /*

   * =====================================================

   * WISHLIST

   * =====================================================

   */



  const isWishlisted = (product) => {

    if (!product?.wishlistedBy) {

      return false;

    }



    const currentUserId =

      user?._id ||

      user?.id;



    if (!currentUserId) {

      return false;

    }



    return product.wishlistedBy.some(

      (id) =>

        String(

          typeof id === "object"

            ? id._id

            : id

        ) === String(currentUserId)

    );

  };





  const toggleWishlist = async (id) => {

    try {

      setWishlistLoading(id);



      const response =

        await authFetch(

          `/api/student/marketplace/${id}/wishlist`,

          {

            method: "PUT",

          }

        );



      const result =

        await response.json();



      if (!response.ok) {

        throw new Error(

          result.message ||

            "Failed to update wishlist."

        );

      }



      /*

       * Backend returns the updated item.

       */



      if (result.data) {

        setProducts((current) =>

          current.map((item) =>

            item._id === result.data._id

              ? result.data

              : item

          )

        );



        /*

         * Also update currently

         * opened product.

         */



        if (

          selectedProduct?._id ===

          result.data._id

        ) {

          setSelectedProduct(

            result.data

          );

        }

      }



    } catch (err) {

      console.error(

        "Wishlist error:",

        err

      );



      alert(

        err.message ||

          "Unable to update wishlist."

      );



    } finally {

      setWishlistLoading(null);

    }

  };





  /*

   * =====================================================

   * CREATE LISTING

   * =====================================================

   */



const createListing = async (

  event,

  selectedImages = []

) => {

  event.preventDefault();



  try {

    setCreating(true);

    setError("");



    const form =

      new FormData(

        event.currentTarget

      );



    const listingType =

      String(

        form.get("type") || "sell"

      ).toLowerCase();



    const requestData =

      new FormData();



    requestData.append(

      "title",

      String(

        form.get("title") || ""

      ).trim()

    );



    requestData.append(

      "description",

      String(

        form.get("description") || ""

      ).trim()

    );



    requestData.append(

      "category",

      form.get("category")

    );



    requestData.append(

      "type",

      listingType

    );



    requestData.append(

      "condition",

      form.get("condition")

    );



    requestData.append(

      "price",

      listingType === "donate"

        ? "0"

        : String(

            form.get("price") || 0

          )

    );





    /*

     * Add all selected images.

     */



    selectedImages.forEach(

      (file) => {

        requestData.append(

          "images",

          file

        );

      }

    );





    const response =

      await authFetch(

        "/api/student/marketplace",

        {

          method: "POST",

          body: requestData,

        }

      );



    const result =

      await response.json();



    if (!response.ok) {

      throw new Error(

        result.message ||

          "Failed to create listing."

      );

    }





    setShowSellModal(false);



    setView(

      "My Listings"

    );



    await loadMarketplace();



  } catch (err) {

    console.error(

      "Create listing error:",

      err

    );



    alert(

      err.message ||

        "Unable to create listing."

    );



  } finally {

    setCreating(false);

  }

};





  /*

   * =====================================================

   * FILTERING

   *

   * Search/category/type are already handled

   * by backend.

   *

   * Wishlist/My Listings are filtered locally.

   * =====================================================

   */



  const filteredProducts =

    useMemo(() => {

      let list = products;



      /*

       * Wishlist

       */



      if (view === "Wishlist") {

        list = list.filter(

          (product) =>

            isWishlisted(product)

        );

      }





      /*

       * My Listings

       */



      if (view === "My Listings") {

        const currentUserId =

          user?._id ||

          user?.id;



        list = list.filter(

          (product) => {

            const sellerId =

              product.seller?._id ||

              product.seller;



            return (

              currentUserId &&

              String(sellerId) ===

                String(currentUserId)

            );

          }

        );

      }



      return list;



    }, [

      products,

      view,

      user,

    ]);





  /*

   * =====================================================

   * STATISTICS

   * =====================================================

   */



  const wishlistCount =

    products.filter(

      (product) =>

        isWishlisted(product)

    ).length;





  const donationCount =

    products.filter(

      (product) =>

        product.type === "donate"

    ).length;





  /*

   * =====================================================

   * RENDER

   * =====================================================

   */



  return (

    <div className="marketplace-page">



      {/* ============================================= */}

      {/* HEADER */}

      {/* ============================================= */}



      <div className="module-heading">



        <div>



          <p className="page-eyebrow">

            STUDENT MARKETPLACE

          </p>



          <h1>

            Marketplace

          </h1>



          <p>

            Buy, sell and donate useful

            items within the JIT community.

          </p>



        </div>





        <button

          className="primary-action"

          onClick={() =>

            setShowSellModal(true)

          }

        >

          <Plus size={17} />



          Create Listing

        </button>



      </div>





      {/* ============================================= */}

      {/* STATISTICS */}

      {/* ============================================= */}



      <div className="marketplace-stats">



        <MarketStat

          icon={<ShoppingBag />}

          value={products.length}

          label="Active Listings"

        />



        <MarketStat

          icon={<Gift />}

          value={donationCount}

          label="Free Donations"

        />



        <MarketStat

          icon={<Heart />}

          value={wishlistCount}

          label="Saved Items"

        />



      </div>





      {/* ============================================= */}

      {/* TABS */}

      {/* ============================================= */}



      <div className="market-tabs">



        {[

          "Browse",

          "Wishlist",

          "My Listings",

        ].map((item) => (



          <button

            key={item}

            className={

              view === item

                ? "active"

                : ""

            }

            onClick={() =>

              setView(item)

            }

          >

            {item}

          </button>



        ))}



      </div>





      {/* ============================================= */}

      {/* TOOLBAR */}

      {/* ============================================= */}



      <section className="market-toolbar">



        <div className="resource-search">



          <Search size={18} />



          <input

            value={search}

            onChange={(event) =>

              setSearch(

                event.target.value

              )

            }

            placeholder="Search books, calculators, notes..."

          />



        </div>





        <select

          value={listingType}

          onChange={(event) =>

            setListingType(

              event.target.value

            )

          }

        >

          <option>

            All

          </option>



          <option>

            Sell

          </option>



          <option>

            Donate

          </option>

        </select>





        <button

          type="button"

          className="refresh-button"

          onClick={() =>

            loadMarketplace(true)

          }

          disabled={refreshing}

          title="Refresh marketplace"

        >

          <RefreshCw

            size={17}

            className={

              refreshing

                ? "spin"

                : ""

            }

          />

        </button>



      </section>





      {/* ============================================= */}

      {/* CATEGORIES */}

      {/* ============================================= */}



      <div className="market-categories">



        {categories.map(

          (item) => (



            <button

              key={item}

              className={

                category === item

                  ? "active"

                  : ""

              }

              onClick={() =>

                setCategory(item)

              }

            >

              {item}

            </button>



          )

        )}



      </div>





      {/* ============================================= */}

      {/* HEADING */}

      {/* ============================================= */}



      <div className="resources-heading">



        <h3>

          {view}

        </h3>



        <span>

          {filteredProducts.length} items

        </span>



      </div>





      {/* ============================================= */}

      {/* ERROR */}

      {/* ============================================= */}



      {error && !loading && (



        <div className="error-state">



          <Package size={32} />



          <h3>

            Something went wrong

          </h3>



          <p>

            {error}

          </p>



          <button

            className="primary-action"

            onClick={() =>

              loadMarketplace()

            }

          >

            Try Again

          </button>



        </div>



      )}





      {/* ============================================= */}

      {/* LOADING */}

      {/* ============================================= */}



      {loading && (



        <div className="empty-state">



          <Loader2

            size={35}

            className="spin"

          />



          <h3>

            Loading marketplace...

          </h3>



          <p>

            Fetching the latest listings.

          </p>



        </div>



      )}





      {/* ============================================= */}

      {/* PRODUCT GRID */}

      {/* ============================================= */}



      {!loading &&

        !error &&

        filteredProducts.length > 0 && (



          <div className="market-grid">



            {filteredProducts.map(

              (product) => (



                <ProductCard

                  key={product._id}

                  product={product}

                  saved={isWishlisted(

                    product

                  )}

                  wishlistLoading={

                    wishlistLoading ===

                    product._id

                  }

                  toggleWishlist={

                    toggleWishlist

                  }

                  openProduct={

                    setSelectedProduct

                  }

                />



              )

            )}



          </div>



        )}





      {/* ============================================= */}

      {/* EMPTY STATE */}

      {/* ============================================= */}



      {!loading &&

        !error &&

        filteredProducts.length === 0 && (



          <div className="empty-state">



            <Package size={35} />



            <h3>

              No items found

            </h3>



            <p>

              {view === "My Listings"

                ? "You haven't created any marketplace listings yet."

                : view === "Wishlist"

                ? "You haven't saved any items yet."

                : "Try changing your search or filters."}

            </p>



            {view === "My Listings" && (



              <button

                className="primary-action"

                onClick={() =>

                  setShowSellModal(true)

                }

              >

                <Plus size={16} />

                Create Listing

              </button>



            )}



          </div>



        )}





      {/* ============================================= */}

      {/* CREATE LISTING MODAL */}

      {/* ============================================= */}



      {showSellModal && (



        <CreateListingModal

          close={() =>

            setShowSellModal(false)

          }

          submit={

            createListing

          }

          creating={creating}

        />



      )}





      {/* ============================================= */}

      {/* PRODUCT DETAILS MODAL */}

      {/* ============================================= */}



      {selectedProduct && (



        <ProductModal

          product={

            selectedProduct

          }

          close={() =>

            setSelectedProduct(null)

          }

          saved={isWishlisted(

            selectedProduct

          )}

          toggleWishlist={

            toggleWishlist

          }

          wishlistLoading={

            wishlistLoading ===

            selectedProduct._id

          }

          currentUserId={

            user?._id || user?.id

          }

        />



      )}



    </div>

  );

}





/*

 * =====================================================

 * MARKET STAT

 * =====================================================

 */



function MarketStat({

  icon,

  value,

  label,

}) {

  return (

    <div className="resource-stat">



      <div>

        {icon}

      </div>



      <section>



        <strong>

          {value}

        </strong>



        <span>

          {label}

        </span>



      </section>



    </div>

  );

}





/*

 * =====================================================

 * PRODUCT CARD

 * =====================================================

 */



function ProductCard({

  product,

  saved,

  wishlistLoading,

  toggleWishlist,

  openProduct,

}) {

  const sellerName =

    product.seller?.name ||

    "JIT Student";



  const sellerEmail =

    product.seller?.email ||

    "";



  return (

    <article className="product-card">



      <div className="product-image-placeholder">



  {product.images &&

  product.images.length > 0 ? (

    <img

      src={`http://localhost:5000${product.images[0]}`}

      alt={product.title}

      className="product-image"

    />

  ) : (

    <ShoppingBag size={32} />

  )}





        <span

          className={

            product.type === "donate"

              ? "listing-badge donate"

              : "listing-badge sell"

          }

        >

          {product.type ===

          "donate"

            ? "Donate"

            : "Sell"}

        </span>





        <button

          className={`product-heart ${

            saved ? "saved" : ""

          }`}

          onClick={() =>

            toggleWishlist(

              product._id

            )

          }

          disabled={

            wishlistLoading

          }

        >



          {wishlistLoading ? (



            <Loader2

              size={18}

              className="spin"

            />



          ) : (



            <Heart size={18} />



          )}



        </button>



      </div>





      <div className="product-body">



        <span className="product-category">

          {product.category}

        </span>



        <h3>

          {product.title}

        </h3>





        <strong className="product-price">



          {product.type ===

          "donate"

            ? "FREE"

            : `₹${product.price || 0}`}



        </strong>





        <div className="product-info">



          <span>

            {product.condition ||

              "Not specified"}

          </span>



          <span>

            {product.status ||

              "Available"}

          </span>



        </div>





        <div className="seller-info">



          <User size={13} />



          <span>

            {sellerName}

          </span>



        </div>





        <button

          className="view-product"

          onClick={() =>

            openProduct(product)

          }

        >

          View Details

        </button>



      </div>



    </article>

  );

}





/*

 * =====================================================

 * CREATE LISTING MODAL

 * =====================================================

 */



function CreateListingModal({

  close,

  submit,

  creating,

}) {

  const [type, setType] =

    useState("sell");



  const [selectedImages, setSelectedImages] =

    useState([]);



  const [previews, setPreviews] =

    useState([]);





  const handleImageChange = (

    event

  ) => {

    const files = Array.from(

      event.target.files || []

    );



    if (files.length === 0) {

      return;

    }



    const validFiles =

      files.filter((file) => {

        const validTypes = [

          "image/jpeg",

          "image/jpg",

          "image/png",

          "image/webp",

        ];



        return (

          validTypes.includes(

            file.type

          ) &&

          file.size <=

            5 * 1024 * 1024

        );

      });



    if (

      validFiles.length !==

      files.length

    ) {

      alert(

        "Only JPG, PNG and WEBP images under 5MB are allowed."

      );

    }



    const combinedFiles = [

      ...selectedImages,

      ...validFiles,

    ].slice(0, 5);



    setSelectedImages(

      combinedFiles

    );



    const newPreviews =

      combinedFiles.map((file) =>

        URL.createObjectURL(file)

      );



    previews.forEach((url) =>

      URL.revokeObjectURL(url)

    );



    setPreviews(newPreviews);



    event.target.value = "";

  };





  const removeImage = (index) => {

    const updatedFiles =

      selectedImages.filter(

        (_, fileIndex) =>

          fileIndex !== index

      );



    const updatedPreviews =

      previews.filter(

        (_, previewIndex) =>

          previewIndex !== index

      );



    setSelectedImages(

      updatedFiles

    );



    setPreviews(

      updatedPreviews

    );

  };





  const handleSubmit = (event) => {

    submit(

      event,

      selectedImages

    );

  };





  return (

    <div className="modal-overlay">



      <div className="resource-modal">



        <div className="modal-header">



          <div>



            <h2>

              Create Listing

            </h2>



            <p>

              Sell or donate an item

              to another JIT student.

            </p>



          </div>



          <button

            type="button"

            onClick={close}

            disabled={creating}

          >

            <X size={20} />

          </button>



        </div>





        <form

          onSubmit={handleSubmit}

        >



          <label>

            Listing Type

          </label>



          <select

            name="type"

            value={type}

            onChange={(event) =>

              setType(

                event.target.value

              )

            }

            disabled={creating}

          >

            <option value="sell">

              Sell

            </option>



            <option value="donate">

              Donate

            </option>

          </select>





          <label>

            Item Name

          </label>



          <input

            name="title"

            placeholder="Example: Scientific Calculator"

            required

            disabled={creating}

          />





          <div className="modal-form-grid">



            <div>



              <label>

                Category

              </label>



              <select

                name="category"

                required

                disabled={creating}

              >



                <option value="Books">

                  Books

                </option>



                <option value="Notes">

                  Notes

                </option>



                <option value="Calculators">

                  Calculators

                </option>



                <option value="Lab Items">

                  Lab Items

                </option>



                <option value="Tools">

                  Tools

                </option>



                <option value="Question Papers">

                  Question Papers

                </option>



                <option value="Electronics">

                  Electronics

                </option>



              </select>



            </div>





            <div>



              <label>

                Condition

              </label>



              <select

                name="condition"

                required

                disabled={creating}

              >



                <option value="New">

                  New

                </option>



                <option value="Like New">

                  Like New

                </option>



                <option value="Good">

                  Good

                </option>



                <option value="Fair">

                  Fair

                </option>



              </select>



            </div>



          </div>





          {type === "sell" && (



            <>



              <label>

                Price (₹)

              </label>



              <input

                name="price"

                type="number"

                min="0"

                placeholder="500"

                required

                disabled={creating}

              />



            </>



          )}





          <label>

            Description

          </label>



          <textarea

            name="description"

            placeholder="Describe the item..."

            rows="4"

            required

            disabled={creating}

          />





          {/* ================================= */}

          {/* IMAGE UPLOAD */}

          {/* ================================= */}



          <label>

            Item Photos

          </label>



          <div className="marketplace-upload-box">



            <input

              id="marketplace-images"

              type="file"

              accept="image/jpeg,image/png,image/webp"

              multiple

              onChange={

                handleImageChange

              }

              disabled={

                creating ||

                selectedImages.length >= 5

              }

              hidden

            />



            <label

              htmlFor="marketplace-images"

              className="marketplace-upload-button"

            >

              <Plus size={18} />



              {selectedImages.length >= 5

                ? "Maximum 5 Photos"

                : "Upload Photos"}

            </label>



            <small>

              Upload up to 5 photos.

              JPG, PNG or WEBP. Maximum

              5MB each.

            </small>



          </div>





          {/* ================================= */}

          {/* IMAGE PREVIEWS */}

          {/* ================================= */}



          {previews.length > 0 && (



            <div className="marketplace-image-preview">



              {previews.map(

                (preview, index) => (



                  <div

                    className="marketplace-preview-item"

                    key={preview}

                  >



                    <img

                      src={preview}

                      alt={`Preview ${

                        index + 1

                      }`}

                    />



                    <button

                      type="button"

                      onClick={() =>

                        removeImage(

                          index

                        )

                      }

                      disabled={creating}

                    >

                      <X size={15} />

                    </button>



                  </div>



                )

              )}



            </div>



          )}





          <div className="modal-actions">



            <button

              type="button"

              onClick={close}

              disabled={creating}

            >

              Cancel

            </button>





            <button

              className="primary-action"

              type="submit"

              disabled={creating}

            >



              {creating ? (

                <>

                  <Loader2

                    size={16}

                    className="spin"

                  />



                  Publishing...

                </>

              ) : (

                <>

                  <Plus size={16} />



                  Publish Listing

                </>

              )}



            </button>



          </div>



        </form>



      </div>



    </div>

  );

}



/*

 * =====================================================

 * PRODUCT DETAILS MODAL

 * =====================================================

 */



function ProductModal({

  product,

  close,

  saved,

  toggleWishlist,

  wishlistLoading,

  currentUserId,

}) {

  const sellerName =

    product.seller?.name ||

    "JIT Student";



  const sellerEmail =

    product.seller?.email ||

    "";





  const sellerId =

    product.seller?._id ||

    product.seller;





  const isMine =

    currentUserId &&

    sellerId &&

    String(currentUserId) ===

      String(sellerId);





  return (

    <div className="modal-overlay">



      <div className="product-detail-modal">



        <div className="modal-header">



          <div>



            <span className="product-category">

              {product.category}

            </span>



            <h2>

              {product.title}

            </h2>



          </div>





          <button

            type="button"

            onClick={close}

          >

            <X size={20} />

          </button>



        </div>





        <div className="product-detail-image">



  {product.images &&

  product.images.length > 0 ? (

    <img

      src={`http://localhost:5000${product.images[0]}`}

      alt={product.title}

    />

  ) : (

    <ShoppingBag size={50} />

  )}



</div>





        <strong className="detail-price">



          {product.type ===

          "donate"

            ? "FREE"

            : `₹${product.price || 0}`}



        </strong>





        <div className="detail-tags">



          <span>

            {product.condition ||

              "Not specified"}

          </span>



          <span>

            {product.category}

          </span>



          <span>

            {product.type ===

            "donate"

              ? "Donate"

              : "Sell"}

          </span>



          <span>

            {product.status ||

              "Available"}

          </span>



        </div>





        <p className="product-description">



          {product.description ||

            "No description provided."}



        </p>





        <div className="seller-panel">



          <div className="seller-avatar">



            <User size={19} />



          </div>





          <div>



            <strong>

              {sellerName}

            </strong>



            <span>

              <MapPin size={12} />



              {sellerEmail ||

                "JIT Student"}

            </span>



          </div>



        </div>





        {!isMine && (



          <div className="product-modal-actions">



            <button

              className={

                saved

                  ? "contact-seller saved-action"

                  : "contact-seller"

              }

              onClick={() =>

                toggleWishlist(

                  product._id

                )

              }

              disabled={

                wishlistLoading

              }

            >



              {wishlistLoading ? (



                <Loader2

                  size={17}

                  className="spin"

                />



              ) : (



                <Heart size={17} />



              )}



              {saved

                ? "Saved"

                : "Save Item"}



            </button>





            <button

              className="contact-seller"

              onClick={() =>

                alert(

                  "Marketplace chat will be connected in the messaging module."

                )

              }

            >



              <MessageCircle

                size={17}

              />



              Contact Seller



            </button>



          </div>



        )}



      </div>



    </div>

  );

}





export default Marketplace;