const { html, css } = Utils;
const { Button, showNotification } = Components.UI;
const { updateEntry, createEntry, deleteEntry } = Netlify;
const { typeToAPIType } = Conversions;
const { isArray } = Array;

const DeleteButton = (type, data) =>
  Button({
    label: "Delete",
    style: ({ id }) => css`
      #${id} {
        ${buttonStyle("#e0480e")}
        margin-left: 5px;
      }
    `,
    onClick: () => {
      if (
        confirm(`Are you sure you want to delete this entry from your list?`)
      ) {
        deleteEntry(type, data.dbRef)
          .map(() => location.reload())
          .mapErr((err) =>
            showNotification(`Error deleting this entry: ${err}`)
          );
      }
    },
  });

const SubmitButton = (type, data, isEdit) =>
  Button({
    label: isEdit ? "Edit entry" : "Add entry",
    style: ({ id }) => css`
      #${id} {
        ${buttonStyle("#0E9CE0")}
        margin-right: 5px;
      }
    `,
    onClick: () =>
      (isEdit
        ? updateEntry(type, data.dbRef, generateEntry(data, type))
        : createEntry(type, generateEntry(data, type))
      )
        .map(() => location.reload())
        .mapErr((err) =>
          showNotification(
            `Error ${isEdit ? "editing" : "adding"} this entry: ${err}`
          )
        ),
  });

Components.List.SubmitButton = SubmitButton;
Components.List.DeleteButton = DeleteButton;

///////////////////////////////////////////////////////////////////////////////

const buttonStyle = (color) => `
  margin: auto;
  cursor: pointer;
  padding: 10px 30px;
  background: ${color};
  border-radius: 7px;
  color: white;
  border: 0;
  font-weight: bold;
  font-size: 17px;
  margin-bottom: 10px;
  display: inline-block;
`;

const getCommaSeparated = (id) =>
  $(`#${id}`)
    .val()
    .split(",")
    .map((x) => x.trim());

const getInt = (id) => parseInt($(`#${id}`).val()) || undefined;
const getIntOrNull = (id) => {
  const fieldVal = $(`#${id}`).val();
  return fieldVal === "" ? null : parseInt(fieldVal) || undefined;
};

const getFloat = (id) => parseFloat($(`#${id}`).val()) || undefined;

const generateEntry = (data, type) => ({
  commonMetadata: null, // We used to use this but now we use workRef instead
  workRef: data?.commonMetadata.internalRef,
  overrides: getOverrides(data?.apiData, type),
  status: $("#status").val(),
  score: parseInt($("#score").val()) || null,
  completedDate: Date.parse($("#completed-date").val()) || null,
  review: $("#review").val(),
  ...(type === "films"
    ? {}
    : { startedDate: Date.parse($("#started-date").val()) || null }),
  ...(type === "tv" ? { progress: getInt("progress") || null } : {}),
});

const emptyMetadata = (type) => ({
  entryType: typeToAPIType[type],
  englishTranslatedTitle: "N/A",
  apiRefs: [],
});

const getOverrides = (api, type) => {
  const englishTranslatedTitle = getIfDifferent(
    api?.englishTranslatedTitle,
    $("#title").val()
  );
  const duration =
    api?.duration === getFloat("duration") * (type === "games" ? 60 : 1)
      ? null
      : getFloat("duration") * (type === "games" ? 60 : 1);
  getIfDifferent(api?.duration, getFloat("duration"));
  return {
    englishTranslatedTitle,
    originalTitle:
      getIfDifferent(api?.originalTitle, $("#original-title").val()) ?? null,
    releaseYear: getIfDifferent(api?.releaseYear, getIntOrNull("release-year")),
    duration,
    imageUrl: getIfDifferent(api?.imageUrl, $("#image-url").val()),
    genres: getIfDifferent(api?.genres, getCommaSeparated("genres")),
    ...(type === "films"
      ? {
          directors: getIfDifferent(
            api?.directors,
            getCommaSeparated("directors")
          ),
          actors: getIfDifferent(api?.actors, getCommaSeparated("actors")),
        }
      : type === "books"
      ? {
          authors: getIfDifferent(api?.authors, getCommaSeparated("authors")),
        }
      : type === "games"
      ? {
          platforms: getIfDifferent(
            api?.platforms,
            getCommaSeparated("platforms")
          ),
          studios: getIfDifferent(api?.studios, getCommaSeparated("studios")),
          publishers: getIfDifferent(
            api?.publishers,
            getCommaSeparated("publishers")
          ),
        }
      : /* type === 'tv' */ {
          directors: getIfDifferent(
            api?.directors,
            getCommaSeparated("directors")
          ),
          actors: getIfDifferent(api?.actors, getCommaSeparated("actors")),
          episodes: getIfDifferent(api?.episodes, getInt("episodes")),
        }),
  };
};

const getIfDifferent = (apiVal, userVal) => {
  const areEqual = isArray(apiVal) ? areArraysIdentical : (a, b) => a === b;
  return areEqual(apiVal, userVal) ? null : userVal || null;
};

const areArraysIdentical = (arr1, arr2) => {
  const arr1NoEmpty = arr1.filter((e) => e !== "");
  const arr2NoEmpty = arr2.filter((e) => e !== "");
  return (
    arr1NoEmpty.length === arr2NoEmpty.length &&
    arr1NoEmpty.every((el, i) => arr2NoEmpty[i] === el)
  );
};
